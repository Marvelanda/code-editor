import { Dispatch } from 'redux';
import axios from 'axios';
import { ActionType } from '../action-types';
import {
  Action,
  CreateSession,
  DeleteCellAction,
  Direction,
  InsertCellAfterAction,
  MoveCellAction,
  UpdateCellAction,
} from '../actions';
import { Cell, CellTypes } from '../cell';
import bundle from '../../bundler';
import { RootState } from '../reducers';
import { randomId } from '../../utils';

const BASE_LINK =
  'https://code-editor-app-12858-default-rtdb.europe-west1.firebasedatabase.app';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

export const addUser = (name: string): CreateSession => {
  return {
    type: ActionType.CREATE_SESSION,
    payload: name,
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};

export const createSession = () => {
  return async (dispatch: Dispatch<Action>) => {
    const cell: Cell = {
      content: '',
      type: 'code',
      id: randomId(),
    };

    try {
      const { data }: { data: { name: string } } = await axios.post(
        `${BASE_LINK}/users.json`,
        {
          order: [cell.id],
          data: {
            [cell.id]: cell,
          },
        }
      );

      dispatch(addUser(data.name));

      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: {
          order: [cell.id],
          data: {
            [cell.id]: cell,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const fetchCells = (user: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.FETCH_CELLS });

    try {
      const {
        data: axiosData,
      }: {
        data: {
          order: string[];
          data: {
            [key: string]: Cell;
          };
        };
      } = await axios.get(`${BASE_LINK}/users/${user}.json`);
      const { order, data } = axiosData || {};

      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: { order, data },
      });
    } catch (err) {
      if (!(err instanceof Error)) {
        return;
      }

      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { data, order, userId },
    } = getState();

    try {
      await axios.put(`${BASE_LINK}/users/${userId}.json`, { data, order });
    } catch (err) {
      if (!(err instanceof Error)) {
        return;
      }

      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};
