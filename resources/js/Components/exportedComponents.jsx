import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  DialogTitle,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Datatable from '@/components/Datatable';
import InputLabel from '@/components/InputLabel';
import LoadingDiv from '@/components/LoadingDiv';
import TextInput from '@/components/TextInput';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const exportedComponents = {
  React,
  useEffect,
  useState,
  useForm,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  DialogTitle,
  ListItemText,
  OutlinedInput,
  Chip,
  Stack,
  Datatable,
  InputLabel,
  LoadingDiv,
  TextInput
};

export default exportedComponents;

// Aquí puedes escribir el resto del código de tu archivo
