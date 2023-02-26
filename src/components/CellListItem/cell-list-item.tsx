import React from 'react';

import { Cell } from '../../store';

import CodeCell from '../CodeCell/code-cell';
import TextEditor from '../TextEditor/text-editor';
import ActionBar from '../ActionBar/action-bar';

import './cell-list-item.css';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  return (
    <div className="cell-list-item">
      {cell.type === 'code' ? (
        <>
          <div className="action-bar-wrapper">
            <ActionBar id={cell.id} />
          </div>

          <CodeCell cell={cell} />
        </>
      ) : (
        <>
          <TextEditor cell={cell} />

          <ActionBar id={cell.id} />
        </>
      )}
    </div>
  );
};

export default CellListItem;
