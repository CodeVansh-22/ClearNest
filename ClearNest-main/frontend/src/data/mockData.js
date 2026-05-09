export const statsData = [
  { label: 'Total Reserves', value: '₹124,500', change: '+12%', positive: true },
  { label: 'Maintenance Dues', value: '₹1,200', change: 'Due in 3 days', positive: false },
  { label: 'Active Complaints', value: '8', change: '-2 from last week', positive: true },
  { label: 'Voter Turnout', value: '78%', change: '+5% goal', positive: true },
];

export const transactions = [
  { id: 1, type: 'Income', category: 'Maintenance', amount: 450, date: '2024-05-01', status: 'Completed', resident: 'Unit 402' },
  { id: 2, type: 'Expense', category: 'Security', amount: -2100, date: '2024-04-28', status: 'Completed', vendor: 'SafeGuard Pro' },
  { id: 3, type: 'Expense', category: 'Landscaping', amount: -850, date: '2024-04-25', status: 'Pending', vendor: 'GreenThumb' },
  { id: 4, type: 'Income', category: 'Clubhouse', amount: 120, date: '2024-04-22', status: 'Completed', resident: 'Unit 105' },
  { id: 5, type: 'Expense', category: 'Repairs', amount: -4500, date: '2024-04-20', status: 'Completed', vendor: 'QuickFix Ltd' },
];

export const ledgerData = [
  { month: 'Jan', income: 45000, expense: 32000 },
  { month: 'Feb', income: 48000, expense: 35000 },
  { month: 'Mar', income: 42000, expense: 41000 },
  { month: 'Apr', income: 52000, expense: 38000 },
  { month: 'May', income: 55000, expense: 34000 },
];

export const complaints = [
  { id: 'C-101', title: 'Leaking Pipe in Lobby', priority: 'High', status: 'In Progress', category: 'Plumbing', date: '2h ago' },
  { id: 'C-102', title: 'Elevator B Intercom Noise', priority: 'Medium', status: 'Submitted', category: 'Maintenance', date: '5h ago' },
  { id: 'C-103', title: 'Street Light #12 Out', priority: 'Low', status: 'Resolved', category: 'Electrical', date: '1d ago' },
  { id: 'C-104', title: 'Gym Equipment Repair', priority: 'Medium', status: 'In Progress', category: 'Amenities', date: '2d ago' },
];

export const votingResolutions = [
  { id: 1, title: 'Solar Panel Installation', description: 'Proposing installation of solar panels on Block A roof to reduce energy costs by 30%.', votes: 142, total: 200, endsIn: '2 days' },
  { id: 2, title: 'New Gym Equipment', description: 'Upgrade existing treadmills and add a multi-gym station.', votes: 85, total: 200, endsIn: '5 days' },
];

export const vendors = [
  { id: 1, name: 'SafeGuard Pro', service: 'Security', rating: 4.8, bids: 3, activeContracts: 1 },
  { id: 2, name: 'GreenThumb', service: 'Landscaping', rating: 4.5, bids: 2, activeContracts: 1 },
  { id: 3, name: 'QuickFix Ltd', service: 'Maintenance', rating: 4.2, bids: 5, activeContracts: 0 },
];
