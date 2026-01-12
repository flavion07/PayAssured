import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, LinearProgress, Tooltip } from '@mui/material';
import { Layout } from '@/components/Layout';
import { casesAPI } from '@/services/api';
import { useSnackbar } from 'notistack';
import { formatCurrency } from '@/utils/format';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inFollowUp: 0,
    partiallyPaid: 0,
    closed: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    collectedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const cases = await casesAPI.list(0, 1000);

        const totalRevenue = cases.reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);
        const closedRevenue = cases
          .filter((c) => c.status === 'Closed')
          .reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);
        const pendingRevenue = totalRevenue - closedRevenue;

        setStats({
          total: cases.length,
          new: cases.filter((c) => c.status === 'New').length,
          inFollowUp: cases.filter((c) => c.status === 'In Follow-up').length,
          partiallyPaid: cases.filter((c) => c.status === 'Partially Paid').length,
          closed: cases.filter((c) => c.status === 'Closed').length,
          totalRevenue,
          pendingRevenue,
          collectedRevenue: closedRevenue,
        });
      } catch (error) {
        enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [enqueueSnackbar]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    gradient,
    subtitle,
  }: {
    title: string;
    value: number;
    icon: any;
    gradient: string;
    subtitle?: string;
  }) => (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: gradient,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, color: 'white', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: '2.5rem',
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 14 }} />
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Welcome back! Here's what's happening with your cases today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cases"
            value={stats.total}
            icon={AssignmentIcon}
            gradient="linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)"
            subtitle="+12% vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Cases"
            value={stats.new}
            icon={WarningIcon}
            gradient="linear-gradient(135deg, #F97316 0%, #F59E0B 100%)"
            subtitle="Needs attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Follow-up"
            value={stats.inFollowUp}
            icon={PendingIcon}
            gradient="linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)"
            subtitle="Active tracking"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Closed Cases"
            value={stats.closed}
            icon={CheckCircleIcon}
            gradient="linear-gradient(135deg, #34D399 0%, #16A34A 100%)"
            subtitle="Success rate trending up"
          />
        </Grid>
      </Grid>

      {/* Revenue Metrics */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Total invoice value across all cases" arrow>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(240, 147, 251, 0.3)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CurrencyRupeeIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                    Total Revenue
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {formatCurrency(stats.totalRevenue)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Across {stats.total} cases
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Revenue from closed and completed cases" arrow>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(67, 233, 123, 0.3)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                    Collected
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {formatCurrency(stats.collectedRevenue)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {stats.closed} closed cases
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Outstanding amount from pending cases" arrow>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(250, 112, 154, 0.3)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PendingIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                    Pending
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {formatCurrency(stats.pendingRevenue)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {stats.total - stats.closed} active cases
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrendingUpIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Case Status Distribution
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>New</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.total > 0 ? (stats.new / stats.total) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #0EA5E9 0%, #38BDF8 100%)',
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>In Follow-up</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stats.total > 0 ? Math.round((stats.inFollowUp / stats.total) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.total > 0 ? (stats.inFollowUp / stats.total) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #0EA5E9 0%, #0F766E 100%)',
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Partially Paid</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stats.total > 0 ? Math.round((stats.partiallyPaid / stats.total) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.total > 0 ? (stats.partiallyPaid / stats.total) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #F97316 0%, #F59E0B 100%)',
                    },
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Closed</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.total > 0 ? (stats.closed / stats.total) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #22C55E 0%, #16A34A 100%)',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AttachMoneyIcon sx={{ color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Quick Stats
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Active Cases
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {stats.total - stats.closed}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Completion Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Pending Actions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {stats.new + stats.inFollowUp}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to PayAssured CRM
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            This is your internal case management dashboard. Use the navigation menu to:
          </Typography>
          <Typography component="ul" variant="body2" sx={{ color: 'text.secondary', mt: 2, lineHeight: 2 }}>
            <li>View and manage all invoicing cases</li>
            <li>Track follow-up status and payment progress</li>
            <li>Manage client information</li>
            <li>Update case notes and status</li>
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}
