import { useMemo, useState, type ReactNode } from 'react'
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import {
  Add,
  AssignmentTurnedInOutlined,
  ChevronLeft,
  ChevronRight,
  DashboardOutlined,
  EventNoteOutlined,
  HealthAndSafetyOutlined,
  Menu as MenuIcon,
  MoreHoriz,
  NotificationsNone,
  Search,
  ShieldOutlined,
  VerifiedOutlined,
  WarningAmberOutlined,
  WorkOutlined,
} from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  controlOptions,
  frequencyOptions,
  generateHazards,
  generateRecommendations,
  getFunctionalAssessmentLevel,
  scoreHazard,
} from './utils/assessment'
import { useWorkbenchStore } from './store/useWorkbenchStore'
import {
  modifierOptions,
  roleOptions,
  type ControlType,
  type ExposureFrequency,
  type HazardAssessment,
  type Modifier,
  type ProfileStatus,
  type RoleCategory,
  type RoleProfile,
  type ReviewStatus,
} from './types'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#137c72', dark: '#0e5c55', light: '#e4f4f1' },
    secondary: { main: '#577c74' },
    background: { default: '#f5f8f7', paper: '#ffffff' },
    text: { primary: '#203b39', secondary: '#71817e' },
    success: { main: '#348a67' },
    warning: { main: '#d99b36' },
    error: { main: '#c85c57' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.04em' },
    h5: { fontWeight: 700, letterSpacing: '-0.03em' },
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 9, paddingInline: 16 } } },
    MuiCard: { styleOverrides: { root: { border: '1px solid #e8efed', boxShadow: '0 4px 16px rgba(27,65,58,.035)' } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 9 } } },
  },
})

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { label: 'Profiles', path: '/profiles', icon: <WorkOutlined /> },
  { label: 'Reviews', path: '/reviews', icon: <AssignmentTurnedInOutlined /> },
  { label: 'Hazards', path: '/hazards', icon: <WarningAmberOutlined /> },
]

function createProfileId(): string {
  return `profile-${Date.now()}`
}

function currentTimestamp(): string {
  return new Date().toISOString()
}

function App() {
  const [mobileNav, setMobileNav] = useState(false)
  const pendingReviews = useWorkbenchStore((state) => state.profiles.filter((profile) => profile.reviewStatus === 'Pending review').length)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">
        <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
          <div className="brand">
            <div className="brand-mark"><HealthAndSafetyOutlined /></div>
            <div><strong>Health Workbench</strong><small>OCCUPATIONAL HEALTH</small></div>
          </div>
          <div className="workspace-label">WORKSPACE</div>
          <nav className="side-nav">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={() => setMobileNav(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.icon}<span>{item.label}</span>
                {item.label === 'Reviews' && pendingReviews > 0 && <span className="nav-count">{pendingReviews}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="support-card"><div className="support-icon"><ShieldOutlined /></div><strong>People first, always.</strong><p>Thoughtful occupational health starts with understanding every role.</p></div>
            <div className="user-mini"><Avatar sx={{ width: 36, height: 36, bgcolor: '#d7ebe5', color: '#236e63', fontSize: 13, fontWeight: 700 }}>DM</Avatar><div><strong>Dr. Morgan</strong><small>Clinical reviewer</small></div><MoreHoriz sx={{ marginLeft: 'auto', color: '#82908d' }} /></div>
          </div>
        </aside>
        <main className="main-area">
          <header className="topbar">
            <IconButton className="mobile-menu" onClick={() => setMobileNav((value) => !value)}><MenuIcon /></IconButton>
            <div className="breadcrumb">Workspace <ChevronRight /> <strong>Occupational Health</strong></div>
            <div className="top-actions"><span className="environment-tag">DEMO WORKSPACE</span><IconButton><Search /></IconButton><IconButton><NotificationsNone /></IconButton><Avatar sx={{ width: 34, height: 34, bgcolor: '#d7ebe5', color: '#236e63', fontSize: 12, fontWeight: 700 }}>DM</Avatar></div>
          </header>
          <div className="page-wrap">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profiles" element={<ProfilesPage />} />
              <Route path="/profiles/new" element={<ProfileWizard />} />
              <Route path="/profiles/:id/edit" element={<ProfileWizard />} />
              <Route path="/profiles/:id" element={<ProfileDetails />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/hazards" element={<HazardsPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<Typography variant="h4">{title}</Typography>{description && <Typography color="text.secondary" sx={{ mt: 0.7 }}>{description}</Typography>}</div>{action}</div>
}

function Dashboard() {
  const profiles = useWorkbenchStore((state) => state.profiles)
  const pending = profiles.filter((profile) => profile.reviewStatus === 'Pending review').length
  const submitted = profiles.filter((profile) => profile.status !== 'Draft').length
  const average = Math.round(profiles.reduce((sum, profile) => sum + profile.riskScore, 0) / Math.max(profiles.length, 1))
  const metrics = [
    { label: 'Profiles created', value: profiles.length, note: 'Across all work areas', icon: <WorkOutlined />, tint: 'mint' },
    { label: 'Profiles submitted', value: submitted, note: 'Ready for clinical review', icon: <AssignmentTurnedInOutlined />, tint: 'blue' },
    { label: 'Pending reviews', value: pending, note: 'Requires your attention', icon: <EventNoteOutlined />, tint: 'amber' },
    { label: 'Average risk score', value: average, note: 'Across active profiles', icon: <AssessmentIcon />, tint: 'rose' },
  ]
  const recent = [...profiles].sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? '')).slice(0, 4)
  return <>
    <PageHeading eyebrow="WEDNESDAY, 11 NOVEMBER 2026" title="Good morning, Dr. Morgan" description="Here’s an overview of occupational health activity across your workspace." action={<Button component={Link} to="/profiles/new" variant="contained" startIcon={<Add />}>Create profile</Button>} />
    <div className="metric-grid">{metrics.map((metric) => <Card className="metric-card" key={metric.label}><CardContent><div className={`metric-icon ${metric.tint}`}>{metric.icon}</div><div className="metric-label">{metric.label}</div><div className="metric-value">{metric.value}</div><div className="metric-note">{metric.note}</div></CardContent></Card>)}</div>
    <div className="dashboard-grid">
      <Card><CardContent className="section-card-content"><div className="section-heading"><div><Typography variant="h6">Recent profiles</Typography><Typography variant="body2" color="text.secondary">The latest role profiles in your workspace</Typography></div><Button component={Link} to="/profiles" endIcon={<ChevronRight />}>View all</Button></div><ProfileTable profiles={recent} compact /></CardContent></Card>
      <Card className="review-summary"><CardContent><div className="summary-top"><div className="summary-icon"><AssignmentTurnedInOutlined /></div><Chip label="ACTION NEEDED" size="small" className="attention-chip" /></div><Typography variant="h6" sx={{ mt: 2 }}>Reviews need your attention</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.7 }}>There are {pending} submitted profiles waiting for a clinical decision.</Typography><div className="summary-stat"><span>Pending review</span><strong>{pending.toString().padStart(2, '0')}</strong></div><Button component={Link} to="/reviews" variant="contained" fullWidth endIcon={<ChevronRight />}>Go to reviews</Button></CardContent></Card>
    </div>
    <Card className="workflow-card"><CardContent><div className="section-heading"><div><Typography variant="h6">A clearer path to safer work</Typography><Typography variant="body2" color="text.secondary">From role details to an informed clinical decision.</Typography></div><Chip icon={<VerifiedOutlined />} label="4-step workflow" className="soft-chip" /></div><div className="workflow-steps">{[['01','Define the role','Capture work context'],['02','Assess exposure','Select roles and hazards'],['03','Apply controls','Score the remaining risk'],['04','Clinical review','Turn insight into action']].map(([number,title,detail])=><div className="workflow-step" key={number}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</div></CardContent></Card>
  </>
}

function StatusChip({ status }: { status: ProfileStatus | ReviewStatus }) {
  const className = status === 'Approved' ? 'status-approved' : status === 'Pending review' || status === 'Submitted' ? 'status-pending' : status === 'Specialist review' ? 'status-specialist' : status === 'Clarification requested' ? 'status-clarification' : 'status-draft'
  return <Chip className={`status-chip ${className}`} size="small" label={status} />
}

function ProfileTable({ profiles, compact = false, onReview }: { profiles: RoleProfile[]; compact?: boolean; onReview?: (profile: RoleProfile) => void }) {
  const navigate = useNavigate()
  const columns = useMemo<GridColDef<RoleProfile>[]>(() => [
    { field: 'name', headerName: 'PROFILE NAME', flex: 1.3, minWidth: 170, renderCell: (params) => <button className="table-link" onClick={() => navigate(`/profiles/${params.row.id}`)}>{params.value}</button> },
    { field: 'status', headerName: 'STATUS', width: 175, renderCell: (params) => <StatusChip status={params.value as ProfileStatus} /> },
    { field: 'riskScore', headerName: 'RISK SCORE', width: 115, renderCell: (params) => <span className={`risk-value ${params.value >= 8 ? 'risk-high' : ''}`}>{params.value}</span> },
    { field: 'owner', headerName: 'OWNER', width: 135, renderCell: (params) => <span className="owner-cell"><Avatar sx={{ width: 25, height: 25, fontSize: 10, bgcolor: '#e4efec', color: '#45766d' }}>{String(params.value).split(' ').map((part: string) => part[0]).join('')}</Avatar>{params.value}</span> },
    ...(!compact ? [{ field: 'actions', headerName: '', width: 110, sortable: false, filterable: false, renderCell: (params: { row: RoleProfile }) => <Stack direction="row" spacing={0.25}><IconButton size="small" aria-label="View profile" onClick={() => navigate(`/profiles/${params.row.id}`)}><Search fontSize="small" /></IconButton>{onReview && params.row.reviewStatus === 'Pending review' && <IconButton size="small" aria-label="Review profile" onClick={() => onReview(params.row)}><AssignmentTurnedInOutlined fontSize="small" /></IconButton>}<IconButton size="small" aria-label="Edit profile" onClick={() => navigate(`/profiles/${params.row.id}/edit`)}><MoreHoriz fontSize="small" /></IconButton></Stack> }] : []),
  ], [compact, navigate, onReview])
  return <div className="data-grid-wrap"><DataGrid rows={profiles} columns={columns} getRowId={(row) => row.id} autoHeight hideFooter={compact || profiles.length <= 10} pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }} disableRowSelectionOnClick sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { background: '#f8faf9', borderBottom: '1px solid #e9efed' }, '& .MuiDataGrid-columnHeaderTitle': { fontSize: 10, fontWeight: 750, color: '#81908d', letterSpacing: '.08em' }, '& .MuiDataGrid-cell': { borderColor: '#f0f3f2' }, '& .MuiDataGrid-row:hover': { background: '#fbfdfc' }, '& .MuiDataGrid-columnSeparator': { display: 'none' } }} /></div>
}

function ProfilesPage() {
  const profiles = useWorkbenchStore((state) => state.profiles)
  const [query, setQuery] = useState('')
  const filteredProfiles = profiles.filter((profile) =>
    `${profile.name} ${profile.owner} ${profile.roles.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  )
  return <>
    <PageHeading eyebrow="ROLE MANAGEMENT" title="Role profiles" description="Build and maintain a clear picture of health risks across your workforce." action={<Button component={Link} to="/profiles/new" variant="contained" startIcon={<Add />}>New profile</Button>} />
    <Card><CardContent className="table-card-content"><div className="table-toolbar"><div><Typography variant="h6">All profiles</Typography><Typography variant="body2" color="text.secondary">{profiles.length} role profiles in your workspace</Typography></div><TextField size="small" placeholder="Search profiles" value={query} onChange={(event) => setQuery(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ color: '#8a9996' }} /></InputAdornment> } }} /></div><ProfileTable profiles={filteredProfiles} /></CardContent></Card>
  </>
}

function ProfileWizard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = useWorkbenchStore((state) => state.profiles.find((profile) => profile.id === id))
  const saveProfile = useWorkbenchStore((state) => state.saveProfile)
  const [step, setStep] = useState(0)
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [roles, setRoles] = useState<RoleCategory[]>(existing?.roles ?? [])
  const [modifiers, setModifiers] = useState<Modifier[]>(existing?.modifiers ?? [])
  const [hazards, setHazards] = useState<HazardAssessment[]>(existing?.hazards ?? [])
  const [error, setError] = useState('')
  const steps = ['Profile details', 'Role selection', 'Modifiers', 'Hazard assessment', 'Review & submit']
  const toggle = <T extends string>(value: T, values: T[], setValues: (items: T[]) => void) => setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])
  const selectRoles = (next: RoleCategory[]) => {
    setRoles(next)
    const names = generateHazards(next)
    setHazards(names.map((hazardName) => existing?.hazards.find((hazard) => hazard.name === hazardName) ?? ({
      id: hazardName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'),
      name: hazardName,
      controlType: 'Unknown',
      exposureFrequency: 'Unknown',
      score: scoreHazard('Unknown', 'Unknown'),
      generatedAutomatically: true,
    })))
  }
  const updateHazard = (idValue: string, field: 'controlType' | 'exposureFrequency', value: ControlType | ExposureFrequency) => {
    setHazards((items) => items.map((hazard) => {
      if (hazard.id !== idValue) return hazard
      const updated = { ...hazard, [field]: value }
      return { ...updated, score: scoreHazard(updated.controlType, updated.exposureFrequency) }
    }))
  }
  const riskScore = hazards.reduce((total, hazard) => total + hazard.score, 0)
  const functionalLevel = getFunctionalAssessmentLevel(modifiers)
  const recommendations = generateRecommendations(hazards, modifiers, riskScore)
  const advance = () => {
    if (step === 0 && !name.trim()) return setError('Add a profile name to continue.')
    if (step === 1 && roles.length === 0) return setError('Select at least one role category.')
    setError('')
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }
  const save = (submit: boolean) => {
    const profile: RoleProfile = {
      id: existing?.id ?? createProfileId(),
      name: name.trim(),
      description: description.trim(),
      roles,
      modifiers,
      hazards,
      status: submit ? 'Submitted' : 'Draft',
      reviewStatus: submit ? 'Pending review' : 'Not submitted',
      riskScore,
      functionalAssessmentLevel: functionalLevel,
      recommendation: recommendations,
      specialistReviewRequired: riskScore >= 8 || modifiers.some((modifier) => ['Driving/Mobile Plant', 'Work At Height', 'Confined Space', 'Emergency Response'].includes(modifier)),
      owner: existing?.owner ?? 'Jordan Lee',
      submittedAt: submit ? currentTimestamp() : existing?.submittedAt,
    }
    saveProfile(profile)
    navigate(submit ? '/reviews' : '/profiles')
  }
  return <>
    <div className="wizard-back"><Button component={Link} to="/profiles" startIcon={<ChevronLeft />} color="inherit">Back to profiles</Button></div>
    <PageHeading eyebrow="PROFILE BUILDER" title={existing ? 'Edit role profile' : 'Create a role profile'} description="Work through each step to build a thoughtful, review-ready assessment." />
    <Card className="wizard-card"><CardContent>
      <Stepper activeStep={step} alternativeLabel className="wizard-stepper">{steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}</Stepper>
      <Divider sx={{ my: 3 }} />
      <div className="wizard-content">
        {step === 0 && <div className="step-panel"><div className="step-icon"><WorkOutlined /></div><Typography variant="h5">Start with the role</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Give this profile a clear name and describe the work it covers.</Typography><div className="form-stack"><TextField label="Profile name" required fullWidth placeholder="e.g. Maintenance Technician" value={name} onChange={(event) => setName(event.target.value)} /><TextField label="Role description" fullWidth multiline minRows={4} placeholder="Describe the main responsibilities, work environment and typical tasks..." value={description} onChange={(event) => setDescription(event.target.value)} /></div></div>}
        {step === 1 && <div className="step-panel"><div className="step-icon"><WorkOutlined /></div><Typography variant="h5">What kind of work is involved?</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Select every category that applies. We’ll use these to generate a starting hazard list.</Typography><div className="selection-grid">{roleOptions.map((role) => <SelectionCard key={role} label={role} checked={roles.includes(role)} onClick={() => selectRoles(roles.includes(role) ? roles.filter((item) => item !== role) : [...roles, role])} />)}</div></div>}
        {step === 2 && <div className="step-panel"><div className="step-icon"><ShieldOutlined /></div><Typography variant="h5">Any additional role modifiers?</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Choose additional conditions or responsibilities that affect how this role is assessed.</Typography><div className="selection-grid">{modifierOptions.map((modifier) => <SelectionCard key={modifier} label={modifier} checked={modifiers.includes(modifier)} onClick={() => toggle(modifier, modifiers, setModifiers)} />)}</div><Alert severity="info" sx={{ mt: 2 }}>Driving, working at height, confined spaces and emergency response assign Functional Assessment Level 3.</Alert></div>}
        {step === 3 && <div className="step-panel"><div className="step-icon"><WarningAmberOutlined /></div><Typography variant="h5">Assess the generated hazards</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Choose the primary control and exposure frequency for each hazard. Scores update automatically.</Typography><div className="hazard-editor">{hazards.map((hazard) => <div className="hazard-row" key={hazard.id}><div className="hazard-title"><span className="hazard-bullet" /><strong>{hazard.name}</strong><small>Auto-generated</small></div><FormControl size="small"><InputLabel>Control type</InputLabel><Select label="Control type" value={hazard.controlType} onChange={(event) => updateHazard(hazard.id, 'controlType', event.target.value as ControlType)}>{controlOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select></FormControl><FormControl size="small"><InputLabel>Frequency</InputLabel><Select label="Frequency" value={hazard.exposureFrequency} onChange={(event) => updateHazard(hazard.id, 'exposureFrequency', event.target.value as ExposureFrequency)}>{frequencyOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select></FormControl><div className={`hazard-score ${hazard.score > 0 ? 'positive' : hazard.score < 0 ? 'negative' : ''}`}>{hazard.score > 0 ? '+' : ''}{hazard.score}</div></div>)}</div><div className="risk-total"><span>Total risk score</span><strong>{riskScore}</strong></div></div>}
        {step === 4 && <div className="step-panel"><div className="step-icon"><VerifiedOutlined /></div><Typography variant="h5">Ready for clinical review</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Check the profile summary before submitting.</Typography><div className="review-summary-grid"><div><span className="summary-label">PROFILE</span><strong>{name || 'Untitled profile'}</strong><p>{description || 'No role description provided.'}</p></div><div><span className="summary-label">ROLE CATEGORIES</span><div className="chips-wrap">{roles.map((role) => <Chip key={role} label={role} size="small" />)}</div></div><div><span className="summary-label">MODIFIERS</span><div className="chips-wrap">{modifiers.length ? modifiers.map((modifier) => <Chip key={modifier} label={modifier} size="small" variant="outlined" />) : <span>None selected</span>}</div></div><div><span className="summary-label">ASSESSMENT</span><div className="assessment-metrics"><span><small>Hazards</small><strong>{hazards.length}</strong></span><span><small>Risk score</small><strong>{riskScore}</strong></span><span><small>Functional level</small><strong>{functionalLevel}</strong></span></div></div><div className="recommendation-preview"><span className="summary-label">MOCK CLINICAL RECOMMENDATIONS</span>{recommendations.map((item) => <div className="recommendation-line" key={item}><VerifiedOutlined />{item}</div>)}</div></div></div>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <div className="wizard-footer"><Button color="inherit" disabled={step === 0} onClick={() => setStep((current) => current - 1)} startIcon={<ChevronLeft />}>Previous</Button><div className="wizard-footer-right">{step === 4 && <Button onClick={() => save(false)}>Save draft</Button>}{step < 4 ? <Button variant="contained" onClick={advance} endIcon={<ChevronRight />}>Continue</Button> : <Button variant="contained" onClick={() => save(true)} startIcon={<AssignmentTurnedInOutlined />}>Submit for review</Button>}</div></div>
      </div>
    </CardContent></Card>
  </>
}

function SelectionCard({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return <button type="button" className={`selection-card ${checked ? 'selected' : ''}`} onClick={onClick}><span className="selection-check">{checked ? '✓' : '+'}</span><span>{label}</span></button>
}

function ProfileDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = useWorkbenchStore((state) => state.profiles.find((item) => item.id === id))
  if (!profile) return <Alert severity="warning">This role profile could not be found.</Alert>
  return <>
    <div className="wizard-back"><Button component={Link} to="/profiles" startIcon={<ChevronLeft />} color="inherit">Back to profiles</Button></div>
    <PageHeading eyebrow="ROLE PROFILE" title={profile.name} description={profile.description} action={<Stack direction="row" spacing={1}><StatusChip status={profile.status} /><Button variant="outlined" onClick={() => navigate(`/profiles/${profile.id}/edit`)}>Edit profile</Button></Stack>} />
    <div className="details-grid"><Card><CardContent><Typography variant="h6">Role & modifiers</Typography><div className="detail-block"><span className="summary-label">ROLE CATEGORIES</span><div className="chips-wrap">{profile.roles.map((role) => <Chip key={role} label={role} size="small" />)}</div></div><div className="detail-block"><span className="summary-label">MODIFIERS</span><div className="chips-wrap">{profile.modifiers.length ? profile.modifiers.map((item) => <Chip key={item} label={item} size="small" variant="outlined" />) : 'None selected'}</div></div><div className="assessment-metrics"><span><small>Risk score</small><strong>{profile.riskScore}</strong></span><span><small>Functional level</small><strong>{profile.functionalAssessmentLevel}</strong></span><span><small>Specialist review</small><strong>{profile.specialistReviewRequired ? 'Required' : 'Not indicated'}</strong></span></div></CardContent></Card><Card><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Clinical recommendations</Typography>{profile.recommendation.map((item) => <div className="recommendation-line" key={item}><VerifiedOutlined />{item}</div>)}</CardContent></Card></div>
    <Card sx={{ mt: 2 }}><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Hazard assessment</Typography><HazardTable hazards={profile.hazards} /></CardContent></Card>
  </>
}

function HazardTable({ hazards }: { hazards: HazardAssessment[] }) {
  const columns: GridColDef<HazardAssessment>[] = [
    { field: 'name', headerName: 'HAZARD', flex: 1, minWidth: 160 },
    { field: 'controlType', headerName: 'CONTROL TYPE', flex: 1, minWidth: 150 },
    { field: 'exposureFrequency', headerName: 'EXPOSURE FREQUENCY', flex: 1, minWidth: 170 },
    { field: 'score', headerName: 'SCORE', width: 100, renderCell: (params) => <span className="risk-value">{params.value > 0 ? '+' : ''}{params.value}</span> },
  ]
  return <DataGrid rows={hazards} columns={columns} getRowId={(row) => row.id} autoHeight hideFooter disableRowSelectionOnClick sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { background: '#f8faf9' }, '& .MuiDataGrid-columnHeaderTitle': { fontSize: 10, fontWeight: 750, color: '#81908d', letterSpacing: '.08em' }, '& .MuiDataGrid-columnSeparator': { display: 'none' } }} />
}

function ReviewsPage() {
  const profiles = useWorkbenchStore((state) => state.profiles)
  const updateReview = useWorkbenchStore((state) => state.updateReview)
  const [selected, setSelected] = useState<RoleProfile | null>(null)
  const [note, setNote] = useState('')
  const reviewable = profiles.filter((profile) => profile.status !== 'Draft')
  const handleAction = (reviewStatus: ReviewStatus) => {
    if (!selected) return
    updateReview(selected.id, reviewStatus, note.trim() || undefined)
    setSelected(null)
    setNote('')
  }
  const columns: GridColDef<RoleProfile>[] = [
    { field: 'name', headerName: 'PROFILE', flex: 1.3, minWidth: 180, renderCell: (params) => <strong className="grid-profile-name">{params.value}</strong> },
    { field: 'owner', headerName: 'OWNER', width: 140 },
    { field: 'riskScore', headerName: 'RISK SCORE', width: 120, renderCell: (params) => <strong>{params.value}</strong> },
    { field: 'reviewStatus', headerName: 'REVIEW STATUS', width: 190, renderCell: (params) => <StatusChip status={params.value as ReviewStatus} /> },
    { field: 'submittedAt', headerName: 'SUBMITTED', width: 140, renderCell: (params) => params.value ? new Date(params.value as string).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
    { field: 'actions', headerName: '', width: 125, sortable: false, renderCell: (params) => <Button size="small" variant={params.row.reviewStatus === 'Pending review' ? 'contained' : 'outlined'} disabled={params.row.reviewStatus !== 'Pending review'} onClick={() => setSelected(params.row)}>Review</Button> },
  ]
  return <>
    <PageHeading eyebrow="CLINICAL WORKSPACE" title="Clinical reviews" description="Review submitted role profiles and record a clear clinical outcome." />
    <div className="review-banner"><div className="summary-icon"><AssignmentTurnedInOutlined /></div><div><strong>{profiles.filter((profile) => profile.reviewStatus === 'Pending review').length} profiles awaiting review</strong><p>Prioritise profiles with elevated risk scores or specialist review indicators.</p></div></div>
    <Card><CardContent className="table-card-content"><div className="table-toolbar"><div><Typography variant="h6">Submitted profiles</Typography><Typography variant="body2" color="text.secondary">All profiles sent for clinical review</Typography></div><Chip label={`${reviewable.length} profiles`} className="soft-chip" /></div><DataGrid rows={reviewable} columns={columns} getRowId={(row) => row.id} autoHeight hideFooter disableRowSelectionOnClick sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { background: '#f8faf9' }, '& .MuiDataGrid-columnHeaderTitle': { fontSize: 10, fontWeight: 750, color: '#81908d', letterSpacing: '.08em' }, '& .MuiDataGrid-columnSeparator': { display: 'none' } }} /></CardContent></Card>
    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="md" fullWidth><DialogTitle>Clinical review · {selected?.name}</DialogTitle><DialogContent dividers>{selected && <><div className="dialog-profile-summary"><div><span className="summary-label">ROLE DESCRIPTION</span><p>{selected.description || 'No role description provided.'}</p></div><div><span className="summary-label">ROLE CATEGORIES</span><div className="chips-wrap">{selected.roles.map((role) => <Chip key={role} label={role} size="small" />)}</div></div><div><span className="summary-label">MODIFIERS</span><div className="chips-wrap">{selected.modifiers.length ? selected.modifiers.map((modifier) => <Chip key={modifier} label={modifier} size="small" variant="outlined" />) : 'None selected'}</div></div></div><div className="dialog-profile-meta"><StatusChip status={selected.reviewStatus} /><span>Risk score <strong>{selected.riskScore}</strong></span><span>Functional assessment <strong>Level {selected.functionalAssessmentLevel}</strong></span><span>Specialist review <strong>{selected.specialistReviewRequired ? 'Required' : 'Not indicated'}</strong></span></div><Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Hazards and controls</Typography><HazardTable hazards={selected.hazards} /><Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Mock recommendations</Typography>{selected.recommendation.map((item) => <div className="recommendation-line" key={item}><VerifiedOutlined />{item}</div>)}<TextField label="Clinical notes" multiline minRows={3} fullWidth sx={{ mt: 2 }} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add context for the decision (optional)" /></>}</DialogContent><DialogActions className="dialog-actions"><Button onClick={() => handleAction('Clarification requested')} color="warning">Request clarification</Button><Button onClick={() => handleAction('Specialist review')} color="secondary">Specialist review</Button><Button variant="contained" onClick={() => handleAction('Approved')}>Approve</Button></DialogActions></Dialog>
  </>
}

function HazardsPage() {
  const profiles = useWorkbenchStore((state) => state.profiles)
  const catalog = [
    ['Noise','Manufacturing/Production · Maintenance/Engineering','Audiometry review'],
    ['Hand Arm Vibration','Maintenance/Engineering','HAV symptom surveillance'],
    ['Manual Handling','Maintenance/Engineering · Healthcare/Biological','Musculoskeletal assessment'],
    ['Machinery','Manufacturing/Production · Maintenance/Engineering','Risk-based review'],
    ['Chemical Exposure','Manufacturing · Maintenance · Laboratory · Chemical Handling','Respiratory / skin surveillance'],
    ['Dust','Manufacturing/Production · Maintenance/Engineering','Respiratory surveillance'],
    ['Biological Agents','Laboratory Work · Healthcare/Biological','Immunisation / infection surveillance'],
    ['Sharps','Laboratory Work · Healthcare/Biological','Exposure incident process'],
    ['Heat / Cold / UV','Outdoor/Environmental','Thermal and skin protection'],
    ['DSE / Ergonomics','Office/DSE','Ergonomic workstation assessment'],
  ]
  const generated = new Set(profiles.flatMap((profile) => profile.hazards.map((hazard) => hazard.name)))
  return <>
    <PageHeading eyebrow="EXPOSURE LIBRARY" title="Hazard catalogue" description="A practical reference for automatically generated hazards and typical follow-up." action={<Chip icon={<ShieldOutlined />} label={`${generated.size} active hazards`} className="soft-chip" />} />
    <div className="hazard-catalog">{catalog.map(([name, sources, followup]) => <Card key={name}><CardContent><div className="catalog-card-top"><div className="catalog-icon"><WarningAmberOutlined /></div><Chip label={generated.has(name.split(' / ')[0]) ? 'IN USE' : 'AVAILABLE'} size="small" className={generated.has(name.split(' / ')[0]) ? 'status-chip status-pending' : 'status-chip status-draft'} /></div><Typography variant="h6" sx={{ mt: 2 }}>{name}</Typography><div className="catalog-label">GENERATED FROM</div><Typography variant="body2" color="text.secondary">{sources}</Typography><div className="catalog-label">TYPICAL FOLLOW-UP</div><Typography variant="body2">{followup}</Typography></CardContent></Card>)}</div>
    <Alert severity="info" sx={{ mt: 2 }}>Hazards are generated from selected role categories. This POC uses rule-based recommendations only; it is not clinical advice or a substitute for a competent risk assessment.</Alert>
  </>
}

function AssessmentIcon() {
  return <AssignmentTurnedInOutlined />
}

export default App
