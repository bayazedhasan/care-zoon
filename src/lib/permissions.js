export const MODULES = [
  'dashboard',
  'products',
  'orders',
  'customers',
  'payments',
  'marketing',
  'reviews',
  'shipping',
  'cms',
  'reports',
  'settings',
  'users',
];

export const PERMISSIONS = {
  view: 'view',
  create: 'create',
  edit: 'edit',
  delete: 'delete',
};

export const ROLE_MATRIX = {
  ADMIN: {
    dashboard: ['view'],
    products: ['view', 'create', 'edit', 'delete'],
    orders: ['view', 'create', 'edit', 'delete'],
    customers: ['view', 'create', 'edit', 'delete'],
    payments: ['view', 'create', 'edit', 'delete'],
    marketing: ['view', 'create', 'edit', 'delete'],
    reviews: ['view', 'create', 'edit', 'delete'],
    shipping: ['view', 'create', 'edit', 'delete'],
    cms: ['view', 'create', 'edit', 'delete'],
    reports: ['view'],
    settings: ['view', 'create', 'edit', 'delete'],
    users: ['view', 'create', 'edit', 'delete'],
  },
  MANAGER: {
    dashboard: ['view'],
    products: ['view', 'create', 'edit'],
    orders: ['view', 'create', 'edit'],
    customers: ['view', 'create', 'edit'],
    payments: ['view', 'edit'],
    marketing: ['view', 'create', 'edit'],
    reviews: ['view', 'create', 'edit'],
    shipping: ['view', 'create', 'edit'],
    cms: ['view', 'create', 'edit'],
    reports: ['view'],
    settings: ['view', 'edit'],
    users: ['view'],
  },
  STAFF: {
    dashboard: ['view'],
    products: ['view', 'edit'],
    orders: ['view', 'edit'],
    customers: ['view'],
    payments: ['view'],
    marketing: ['view'],
    reviews: ['view', 'edit'],
    shipping: ['view', 'edit'],
    cms: ['view', 'edit'],
    reports: ['view'],
    settings: ['view'],
    users: ['view'],
  },
};

export function hasPermission(role, module, permission = 'view') {
  const modulePermissions = ROLE_MATRIX[role]?.[module];
  return !!modulePermissions?.includes(permission);
}
