import { writable } from 'svelte/store';
import { Board } from './type/board';

export const board = writable(new Board());
