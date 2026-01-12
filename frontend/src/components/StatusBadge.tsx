import React from 'react';
import { Box } from '@mui/material';
import { CaseStatus } from '@/types';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'small' | 'medium';
}

const statusConfig = {
  New: {
    color: '#0F172A',
    bg: '#E2E8F0',
    gradient: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
  },
  'In Follow-up': {
    color: '#0284C7',
    bg: '#E0F2FE',
    gradient: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)',
  },
  'Partially Paid': {
    color: '#C2410C',
    bg: '#FFF4E5',
    gradient: 'linear-gradient(135deg, #FDBA74 0%, #F97316 100%)',
  },
  Closed: {
    color: '#15803D',
    bg: '#ECFDF3',
    gradient: 'linear-gradient(135deg, #34D399 0%, #16A34A 100%)',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const config = statusConfig[status] || statusConfig['New'];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: size === 'small' ? 1.5 : 2,
        py: size === 'small' ? 0.5 : 0.75,
        borderRadius: 2,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}30`,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        color: config.color,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: `0 2px 8px ${config.color}30`,
        },
      }}
    >
      <FiberManualRecordIcon
        sx={{
          fontSize: size === 'small' ? 8 : 10,
          color: config.color,
        }}
      />
      {status}
    </Box>
  );
};
