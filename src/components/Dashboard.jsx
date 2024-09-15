import React, { useMemo } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useAllUsers } from "../api/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AttachMoney,
  People,
  DataUsage,
  TrendingUp,
} from "@mui/icons-material";
import { lighten } from "@mui/material/styles";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      bgcolor: color,
      color: "white",
      background: `linear-gradient(45deg, ${color} 30%, ${lighten(
        color,
        0.3
      )} 90%)`,
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography color="rgba(255, 255, 255, 0.7)" gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
      <Box sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", borderRadius: "50%", p: 1 }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: usersResponse, isLoading, error } = useAllUsers();

  const users = useMemo(() => usersResponse?.[0]?.data || [], [usersResponse]);

  const stats = useMemo(() => {
    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
    const averageBalance = users.length > 0 ? totalBalance / users.length : 0;
    const topUsers = [...users]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);

    const balanceRanges = [
      { name: "0-1000", count: 0 },
      { name: "1001-5000", count: 0 },
      { name: "5001-10000", count: 0 },
      { name: "10001+", count: 0 },
    ];

    users.forEach((user) => {
      if (user.balance <= 1000) balanceRanges[0].count++;
      else if (user.balance <= 5000) balanceRanges[1].count++;
      else if (user.balance <= 10000) balanceRanges[2].count++;
      else balanceRanges[3].count++;
    });

    return { totalBalance, averageBalance, topUsers, balanceRanges };
  }, [users]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error loading data</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={users.length}
            icon={<People fontSize="large" />}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Balance"
            value={`$${stats.totalBalance.toFixed(2)}`}
            icon={<AttachMoney fontSize="large" />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Balance"
            value={`$${stats.averageBalance.toFixed(2)}`}
            icon={<DataUsage fontSize="large" />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Top Balance"
            value={`$${stats.topUsers[0]?.balance.toFixed(2)}`}
            icon={<TrendingUp fontSize="large" />}
            color="#e91e63"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 400 }}
          >
            <Typography variant="h6" gutterBottom>
              Top 5 Users by Balance
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="balance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 400 }}
          >
            <Typography variant="h6" gutterBottom>
              Balance Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.balanceRanges}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.balanceRanges.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
