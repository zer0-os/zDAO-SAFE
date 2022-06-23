import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ApplicationStatus {
  INITIAL = 'initial',
  LIVE = 'live',
  PAUSED = 'paused',
  ERROR = 'error',
}

export interface ApplicationState {
  readonly applicationStatus: ApplicationStatus;
  readonly blockNumber: { readonly [chainId: string]: number };
  readonly chainId: number;
}

const initialState: ApplicationState = {
  applicationStatus: ApplicationStatus.INITIAL,
  blockNumber: {},
  chainId: 1,
};

export const updateBlockNumber = createAction<{
  chainId: number;
  blockNumber: number;
}>('application/updateBlockNumber');

export const updateChainId = createAction<number>('application/updateChainId');

export const ApplicationSlice = createSlice({
  name: 'Application',
  initialState,
  reducers: {
    setApplicationStatus: (
      state,
      action: PayloadAction<{ appStatus: ApplicationStatus }>
    ) => {
      state.applicationStatus = action.payload.appStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId]
        );
      }
    });

    builder.addCase(updateChainId, (state, action) => {
      state.chainId = action.payload;
    });
  },
});

export const { setApplicationStatus } = ApplicationSlice.actions;

export default ApplicationSlice.reducer;
