import { Constituency } from './types';

export const CONSTITUENCIES: Constituency[] = [
  {
    id: 'c1',
    name: 'North District',
    officerName: 'Officer Sarah Jenkins',
    location: { lat: 34.05, lng: -118.25, x: 20, y: 20 },
    status: 'ACTIVE',
  },
  {
    id: 'c2',
    name: 'East Coast Zone',
    officerName: 'Commander Raj Patel',
    location: { lat: 40.71, lng: -74.00, x: 80, y: 30 },
    status: 'ACTIVE',
  },
  {
    id: 'c3',
    name: 'Central Valley',
    officerName: 'Lt. Mike Chen',
    location: { lat: 39.73, lng: -104.99, x: 50, y: 50 },
    status: 'ALERT',
  },
  {
    id: 'c4',
    name: 'Southern Harbor',
    officerName: 'Director Elena Rodriguez',
    location: { lat: 29.76, lng: -95.36, x: 30, y: 80 },
    status: 'OFFLINE',
  },
  {
    id: 'c5',
    name: 'West Highland',
    officerName: 'Agent David Kim',
    location: { lat: 47.60, lng: -122.33, x: 15, y: 40 },
    status: 'ACTIVE',
  },
];
