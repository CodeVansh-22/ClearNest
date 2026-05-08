export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  SOCIETY_ADMIN: 'SOCIETY_ADMIN',
  COMMITTEE: 'COMMITTEE',
  RESIDENT: 'RESIDENT',
  SECURITY: 'SECURITY',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  SHOP_OWNER: 'SHOP_OWNER',
});

export const COMPLAINT_STATUS = Object.freeze({
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
});

export const VISITOR_STATUS = Object.freeze({
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
});

export const SOCIETY_STATUS = Object.freeze({
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending',
  TRIAL: 'Trial',
});

export const SUBSCRIPTION_PLANS = Object.freeze({
  FREE: { name: 'Free', price: 0, maxFlats: 50, features: ['basic'] },
  STARTER: { name: 'Starter', price: 999, maxFlats: 200, features: ['basic', 'complaints', 'notices'] },
  PRO: { name: 'Pro', price: 2999, maxFlats: 500, features: ['all'] },
  ENTERPRISE: { name: 'Enterprise', price: 9999, maxFlats: Infinity, features: ['all', 'priority_support', 'custom_branding'] },
});

export const SOCKET_EVENTS = Object.freeze({
  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  CHAT_READ: 'chat:read',

  // Visitor
  VISITOR_REQUEST: 'visitor:request',
  VISITOR_APPROVED: 'visitor:approved',
  VISITOR_REJECTED: 'visitor:rejected',

  // Emergency
  EMERGENCY_SOS: 'emergency:sos',
  EMERGENCY_RESOLVED: 'emergency:resolved',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',

  // Complaints
  COMPLAINT_UPDATE: 'complaint:update',

  // Polls
  POLL_VOTE: 'poll:vote',
  POLL_RESULT: 'poll:result',

  // Delivery
  DELIVERY_ARRIVED: 'delivery:arrived',
  DELIVERY_COLLECTED: 'delivery:collected',
});
