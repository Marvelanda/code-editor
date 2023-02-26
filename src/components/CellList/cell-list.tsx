import React, { Fragment, useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useActions } from '../../hooks/use-actions';

import { Cell } from '../../store';

import CellListItem from '../CellListItem/cell-list-item';
import AddCell from '../AddCell/add-cell';

import './cell-list.css';

const CellList: React.FC = () => {
  const [link, setLink] = useState(window.location.href);
  const [copySuccess, setCopySuccess] = useState(false);

  const { addUser, createSession, fetchCells } = useActions();

  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id: string) => data[id]);
  });
  const userId = useTypedSelector(({ cells: { userId } }) => {
    return userId;
  });

  const [search] = useSearchParams();
  const navigate = useNavigate();

  const user = search.get('user');
  const hrefLink = window.location.href;

  useEffect(() => {
    if (!user && !userId) {
      createSession();
      return;
    }

    addUser(user || '');
    fetchCells(user || '');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!hrefLink) {
      return;
    }

    setLink(hrefLink);
  }, [hrefLink]);

  useEffect(() => {
    if (user || !userId) {
      return;
    }

    navigate(`/?user=${userId}`);
  }, [navigate, user, userId]);

  useEffect(() => {
    if (!copySuccess) {
      return;
    }

    const timerID = setTimeout(() => setCopySuccess(false), 1000);

    return () => {
      clearTimeout(timerID);
    };
  }, [copySuccess]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);

    setCopySuccess(true);
  };

  return (
    <div className="cell-list">
      <div className={'card'}>
        <div className={'card-content'}>
          Hi! This is an editor app. To have your progress saved just copy a
          link below and follow it whenever you want to proceed.
          <div className={'input-container'}>
            <div className={'info-link'}>{link}</div>

            <span onClick={handleCopy} className="icon is-small copy-icon">
              <i className="fas fa-copy" />
            </span>

            {copySuccess && (
              <span className="icon is-small">
                <i className="fas fa-check info-check" />
              </span>
            )}
          </div>
        </div>
      </div>

      <AddCell forceVisible={cells.length === 0} previousCellId={null} />

      {!!cells?.length &&
        cells.map((cell: Cell) => (
          <Fragment key={cell.id}>
            <CellListItem cell={cell} />

            <AddCell previousCellId={cell.id} />
          </Fragment>
        ))}
    </div>
  );
};

export default CellList;
