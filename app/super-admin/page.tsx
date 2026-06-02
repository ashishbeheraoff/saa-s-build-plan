"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  CreditCard, 
  Shield, 
  ShieldAlert,
  Search, 
  MoreHorizontal, 
  Mail, 
  Ban, 
  Trash2, 
  Edit, 
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Plus,
  Copy,
  Edit2,
  Gift,
  Mail as MailIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useChartColors } from "@/hooks/use-chart-colors"
import { cn } from "@/lib/utils"
import { EmailTester } from "@/components/email-tester"

// Types
interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: "user" | "admin" | "super_admin"
  subscription_tier: "free" | "starter" | "pro" | "enterprise"
  subscription_status: "active" | "canceled" | "past_due" | "trialing"
  stripe_customer_id: string | null
  last_login_at: string | null
  login_count: number
  created_at: string
  updated_at: string
}

interface UserActivity {
  id: string
  user_id: string
  action: string
  metadata: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Mock data for demo (replace with real Supabase data when connected)
const mockUsers: Profile[] = [
  { id: "1", email: "john@example.com", full_name: "John Doe", avatar_url: null, role: "super_admin", subscription_tier: "enterprise", subscription_status: "active", stripe_customer_id: "cus_123", last_login_at: new Date().toISOString(), login_count: 156, created_at: "2024-01-15T10:00:00Z", updated_at: new Date().toISOString() },
  { id: "2", email: "jane@example.com", full_name: "Jane Smith", avatar_url: null, role: "admin", subscription_tier: "pro", subscription_status: "active", stripe_customer_id: "cus_124", last_login_at: new Date(Date.now() - 86400000).toISOString(), login_count: 89, created_at: "2024-02-20T14:30:00Z", updated_at: new Date().toISOString() },
  { id: "3", email: "bob@example.com", full_name: "Bob Wilson", avatar_url: null, role: "user", subscription_tier: "starter", subscription_status: "active", stripe_customer_id: "cus_125", last_login_at: new Date(Date.now() - 172800000).toISOString(), login_count: 34, created_at: "2024-03-10T09:15:00Z", updated_at: new Date().toISOString() },
  { id: "4", email: "alice@example.com", full_name: "Alice Brown", avatar_url: null, role: "user", subscription_tier: "free", subscription_status: "active", stripe_customer_id: null, last_login_at: new Date(Date.now() - 259200000).toISOString(), login_count: 12, created_at: "2024-04-05T16:45:00Z", updated_at: new Date().toISOString() },
  { id: "5", email: "charlie@example.com", full_name: "Charlie Davis", avatar_url: null, role: "user", subscription_tier: "pro", subscription_status: "past_due", stripe_customer_id: "cus_126", last_login_at: new Date(Date.now() - 604800000).toISOString(), login_count: 67, created_at: "2024-04-20T11:20:00Z", updated_at: new Date().toISOString() },
  { id: "6", email: "diana@example.com", full_name: "Diana Evans", avatar_url: null, role: "user", subscription_tier: "starter", subscription_status: "trialing", stripe_customer_id: "cus_127", last_login_at: new Date(Date.now() - 43200000).toISOString(), login_count: 8, created_at: "2024-05-01T08:00:00Z", updated_at: new Date().toISOString() },
  { id: "7", email: "edward@example.com", full_name: "Edward Fisher", avatar_url: null, role: "user", subscription_tier: "enterprise", subscription_status: "active", stripe_customer_id: "cus_128", last_login_at: new Date(Date.now() - 3600000).toISOString(), login_count: 203, created_at: "2024-01-05T13:30:00Z", updated_at: new Date().toISOString() },
  { id: "8", email: "fiona@example.com", full_name: "Fiona Garcia", avatar_url: null, role: "admin", subscription_tier: "pro", subscription_status: "canceled", stripe_customer_id: "cus_129", last_login_at: new Date(Date.now() - 1209600000).toISOString(), login_count: 45, created_at: "2024-03-25T10:10:00Z", updated_at: new Date().toISOString() },
]

const mockActivity: UserActivity[] = [
  { id: "a1", user_id: "1", action: "login", metadata: { method: "email" }, ip_address: "192.168.1.1", user_agent: "Chrome/120", created_at: new Date().toISOString() },
  { id: "a2", user_id: "2", action: "campaign_created", metadata: { campaign_id: "camp_123" }, ip_address: "192.168.1.2", user_agent: "Firefox/121", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "a3", user_id: "3", action: "lead_exported", metadata: { count: 150 }, ip_address: "192.168.1.3", user_agent: "Safari/17", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "a4", user_id: "1", action: "settings_updated", metadata: { section: "llm_config" }, ip_address: "192.168.1.1", user_agent: "Chrome/120", created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: "a5", user_id: "4", action: "subscription_upgraded", metadata: { from: "free", to: "starter" }, ip_address: "192.168.1.4", user_agent: "Edge/120", created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: "a6", user_id: "5", action: "password_changed", metadata: {}, ip_address: "192.168.1.5", user_agent: "Chrome/120", created_at: new Date(Date.now() - 18000000).toISOString() },
  { id: "a7", user_id: "6", action: "login", metadata: { method: "oauth", provider: "google" }, ip_address: "192.168.1.6", user_agent: "Chrome/120", created_at: new Date(Date.now() - 21600000).toISOString() },
  { id: "a8", user_id: "7", action: "api_key_generated", metadata: {}, ip_address: "192.168.1.7", user_agent: "Postman/10", created_at: new Date(Date.now() - 25200000).toISOString() },
]

// Mock analytics data
const userGrowthData = [
  { date: "Jan", users: 120, active: 95 },
  { date: "Feb", users: 185, active: 142 },
  { date: "Mar", users: 267, active: 198 },
  { date: "Apr", users: 342, active: 278 },
  { date: "May", users: 456, active: 389 },
  { date: "Jun", users: 534, active: 445 },
]

const subscriptionDistribution = [
  { name: "Free", value: 245, color: "#A1A1AA" },
  { name: "Starter", value: 156, color: "#06B6D4" },
  { name: "Pro", value: 98, color: "#7C3AED" },
  { name: "Enterprise", value: 35, color: "#10B981" },
]

const revenueData = [
  { date: "Jan", mrr: 12400, arr: 148800 },
  { date: "Feb", mrr: 15600, arr: 187200 },
  { date: "Mar", mrr: 18900, arr: 226800 },
  { date: "Apr", mrr: 22100, arr: 265200 },
  { date: "May", mrr: 26800, arr: 321600 },
  { date: "Jun", mrr: 31200, arr: 374400 },
]

const activityByHour = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  actions: Math.floor(Math.random() * 100) + 20,
}))

// Helper functions
function formatDate(date: string | null) {
  if (!date) return "Never"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatRelativeTime(date: string | null) {
  if (!date) return "Never"
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

function getInitials(name: string | null, email: string | null) {
  if (name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return "??"
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "super_admin": return "destructive"
    case "admin": return "default"
    default: return "secondary"
  }
}

function getSubscriptionBadgeColor(tier: string) {
  switch (tier) {
    case "enterprise": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "pro": return "bg-primary/20 text-primary border-primary/30"
    case "starter": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "trialing": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "past_due": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "canceled": return "bg-red-500/20 text-red-400 border-red-500/30"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

// KPI Card component
function KPICard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  subtitle
}: { 
  title: string
  value: string | number
  change?: string
  changeType?: "up" | "down" | "neutral"
  icon: React.ElementType
  subtitle?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(change || subtitle) && (
          <div className="flex items-center gap-1 mt-1">
            {change && changeType && (
              <>
                {changeType === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                {changeType === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span className={cn(
                  "text-xs",
                  changeType === "up" && "text-emerald-500",
                  changeType === "down" && "text-red-500",
                  changeType === "neutral" && "text-muted-foreground"
                )}>
                  {change}
                </span>
              </>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// User Management Table
function UserTable({ 
  users, 
  onEditUser, 
  onDeleteUser, 
  onViewUser 
}: { 
  users: Profile[]
  onEditUser: (user: Profile) => void
  onDeleteUser: (user: Profile) => void
  onViewUser: (user: Profile) => void
}) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Logins</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{user.full_name || "No name"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                  {user.role.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("capitalize", getSubscriptionBadgeColor(user.subscription_tier))}>
                  {user.subscription_tier}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("capitalize", getStatusBadgeColor(user.subscription_status))}>
                  {user.subscription_status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatRelativeTime(user.last_login_at)}
              </TableCell>
              <TableCell className="font-mono text-sm">{user.login_count}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewUser(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend User
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDeleteUser(user)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Activity Log component
function ActivityLog({ activities }: { activities: UserActivity[] }) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "login": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "logout": return <XCircle className="h-4 w-4 text-muted-foreground" />
      case "campaign_created": return <Activity className="h-4 w-4 text-primary" />
      case "lead_exported": return <Download className="h-4 w-4 text-cyan-500" />
      case "subscription_upgraded": return <TrendingUp className="h-4 w-4 text-emerald-500" />
      case "subscription_downgraded": return <TrendingDown className="h-4 w-4 text-amber-500" />
      case "password_changed": return <Shield className="h-4 w-4 text-amber-500" />
      case "settings_updated": return <Edit className="h-4 w-4 text-muted-foreground" />
      case "api_key_generated": return <ShieldAlert className="h-4 w-4 text-primary" />
      default: return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {activities.map((activity) => {
          const user = mockUsers.find(u => u.id === activity.user_id)
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="mt-0.5">{getActivityIcon(activity.action)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">
                    {user?.full_name || user?.email || "Unknown User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.created_at)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {activity.action.replace(/_/g, " ")}
                </div>
                {Object.keys(activity.metadata).length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    {JSON.stringify(activity.metadata)}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {activity.ip_address}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

// Main Super Admin Page
export default function SuperAdminPage() {
  const [users, setUsers] = useState<Profile[]>(mockUsers)
  const [activities, setActivities] = useState<UserActivity[]>(mockActivity)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const colors = useChartColors()

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesSubscription = subscriptionFilter === "all" || user.subscription_tier === subscriptionFilter
    return matchesSearch && matchesRole && matchesSubscription
  })

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.subscription_status === "active").length
  const paidUsers = users.filter(u => u.subscription_tier !== "free").length
  const totalRevenue = users.reduce((sum, u) => {
    if (u.subscription_tier === "starter") return sum + 49
    if (u.subscription_tier === "pro") return sum + 149
    if (u.subscription_tier === "enterprise") return sum + 499
    return sum
  }, 0)

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: Profile) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleViewUser = (user: Profile) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const pieColors = [
    colors.muted || "#A1A1AA",
    colors.chart2 || "#06B6D4", 
    colors.chart1 || "#7C3AED",
    colors.success || "#10B981",
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Super Admin</h1>
          <p className="text-muted-foreground text-sm">
            Manage users, view analytics, and monitor system activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          change="+12.5%" 
          changeType="up" 
          icon={Users}
          subtitle="from last month"
        />
        <KPICard 
          title="Active Users" 
          value={activeUsers.toLocaleString()} 
          change="+8.2%" 
          changeType="up" 
          icon={Activity}
          subtitle="from last month"
        />
        <KPICard 
          title="Paid Subscribers" 
          value={paidUsers.toLocaleString()} 
          change="+23.1%" 
          changeType="up" 
          icon={CreditCard}
          subtitle="conversion rate"
        />
        <KPICard 
          title="Monthly Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          change="+18.7%" 
          changeType="up" 
          icon={DollarSign}
          subtitle="MRR"
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="promos" className="gap-2">
            <Gift className="h-4 w-4" />
            Promo Codes
          </TabsTrigger>
          <TabsTrigger value="emails" className="gap-2">
            <MailIcon className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <UserTable 
            users={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onViewUser={handleViewUser}
          />

          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Growth</CardTitle>
                <CardDescription>Total vs active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.chart2 || "#06B6D4"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colors.chart2 || "#06B6D4"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} />
                      <XAxis dataKey="date" stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                      <YAxis stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: colors.card || "#18181B", borderColor: colors.border || "#27272A", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="users" stroke={colors.chart1 || "#7C3AED"} fill="url(#usersGradient)" strokeWidth={2} name="Total Users" />
                      <Area type="monotone" dataKey="active" stroke={colors.chart2 || "#06B6D4"} fill="url(#activeGradient)" strokeWidth={2} name="Active Users" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subscription Distribution</CardTitle>
                <CardDescription>Users by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {subscriptionDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: colors.card || "#18181B", borderColor: colors.border || "#27272A", borderRadius: 8 }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Growth</CardTitle>
                <CardDescription>MRR and ARR over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} />
                      <XAxis dataKey="date" stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                      <YAxis stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: colors.card || "#18181B", borderColor: colors.border || "#27272A", borderRadius: 8 }} />
                      <Line type="monotone" dataKey="mrr" stroke={colors.chart1 || "#7C3AED"} strokeWidth={2} dot={{ r: 4 }} name="MRR" />
                      <Line type="monotone" dataKey="arr" stroke={colors.success || "#10B981"} strokeWidth={2} dot={{ r: 4 }} name="ARR" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity by Hour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity by Hour</CardTitle>
                <CardDescription>User actions distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityByHour}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} />
                      <XAxis dataKey="hour" stroke={colors.mutedForeground || "#A1A1AA"} fontSize={10} interval={3} />
                      <YAxis stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: colors.card || "#18181B", borderColor: colors.border || "#27272A", borderRadius: 8 }} />
                      <Bar dataKey="actions" fill={colors.chart1 || "#7C3AED"} radius={[2, 2, 0, 0]} name="Actions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>Real-time user activity log</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityLog activities={activities} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Codes Tab */}
        <TabsContent value="promos" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Promo Codes</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Promo Code</DialogTitle>
                  <DialogDescription>Generate a new promotional code for discounts</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input placeholder="SUMMER2024" className="uppercase" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="Summer 50% off promotion" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <Input type="number" placeholder="50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Uses</Label>
                      <Input type="number" placeholder="Unlimited" />
                    </div>
                    <div className="space-y-2">
                      <Label>Valid Until</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Code</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Promo Codes Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Codes</CardTitle>
              <CardDescription>Manage promotional discount codes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { code: "SUMMER50", type: "percentage", value: 50, uses: "45/100", validUntil: "2024-08-31", active: true },
                    { code: "WELCOME10", type: "fixed", value: 10, uses: "234/500", validUntil: "2024-12-31", active: true },
                    { code: "NEWUSER20", type: "percentage", value: 20, uses: "1200/Unlimited", validUntil: "2025-12-31", active: true },
                  ].map((promo) => (
                    <TableRow key={promo.code}>
                      <TableCell className="font-mono font-semibold">{promo.code}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {promo.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{promo.value}{promo.type === "percentage" ? "%" : "$"}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{promo.uses}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{promo.validUntil}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              navigator.clipboard.writeText(promo.code)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="emails">
          <EmailTester />
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={selectedUser.full_name || ""} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={selectedUser.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <Select defaultValue={selectedUser.subscription_tier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <Avatar>
                <AvatarFallback>{getInitials(selectedUser.full_name, selectedUser.email)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser.full_name || "No name"}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              setUsers(users.filter(u => u.id !== selectedUser?.id))
              setIsDeleteDialogOpen(false)
            }}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.full_name, selectedUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.full_name || "No name"}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="capitalize">
                      {selectedUser.role.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className={cn("capitalize", getSubscriptionBadgeColor(selectedUser.subscription_tier))}>
                      {selectedUser.subscription_tier}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-mono text-sm">{selectedUser.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Stripe Customer ID</Label>
                  <p className="font-mono text-sm">{selectedUser.stripe_customer_id || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="text-sm">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Last Login</Label>
                  <p className="text-sm">{formatDate(selectedUser.last_login_at)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Total Logins</Label>
                  <p className="text-sm font-mono">{selectedUser.login_count}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Subscription Status</Label>
                  <Badge variant="outline" className={cn("capitalize", getStatusBadgeColor(selectedUser.subscription_status))}>
                    {selectedUser.subscription_status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false)
              handleEditUser(selectedUser!)
            }}>Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
