import { createAction, createSlice } from '@reduxjs/toolkit';

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: string]: number };
  readonly chainId: number;
}

const initialState: ApplicationState = {
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId],
        );
      }
    });

    builder.addCase(updateChainId, (state, action) => {
      state.chainId = action.payload;
    });
  },
});

export default ApplicationSlice.reducer;
