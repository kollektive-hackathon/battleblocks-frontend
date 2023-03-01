import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Block from '@/components/Block.comp';
import Cell from '@/components/Cell.comp';
import DraggableComponent from '@/components/dragAndDrop/Draggable.comp';
import DropTarget from '@/components/dragAndDrop/DropTarget.comp';
import { useNotificationContext } from '@/context/NotificationContext';
import { useUserContext } from '@/context/UserContext';
import { PlacementItem } from '@/types/game';
import { BLOCK_PLACEMENT_DEFAULT, EMPTY_BOARD, getShipCoordinates } from '@/utils/game';

type Props = {
  isJoin: boolean;
};

export default function NewGame(props: Props) {
  const { isJoin } = props;
  const [placements, setPlacements] = useState<PlacementItem[]>([]);
  const [blockPlacements, setBlockPlacements] = useState(BLOCK_PLACEMENT_DEFAULT);

  const { state } = useLocation();
  const { user } = useUserContext();
  const { setNotification } = useNotificationContext();
  const navigate = useNavigate();

  const createMatch = useCallback(() => {
    if (Object.values(blockPlacements).filter((value) => value !== '#e5e5e5').length < 10) {
      setNotification({
        title: 'placement-error',
        description: 'make sure your placed ships contain at least 10 blocks',
      });

      return;
    }

    axios
      .post(`/game${isJoin ? `/${state.id}/join` : ''}`, { stake: state?.stake, placements })
      .then((result) => {
        const { id } = result.data;

        navigate(`/game/${id ?? state.id}`);
      })
      .catch(() =>
        setNotification({
          title: 'game-error',
          description: 'something went wrong when creating game',
        })
      );
  }, [state?.stake, placements]);

  const addPlacement = useCallback(
    (x: number, y: number, blockId: number) => {
      if (placements.find((placement) => placement.blockId === blockId)) {
        setNotification({
          title: 'placement-error',
          description: 'ship can be placed only once',
        });

        return;
      }

      setPlacements((prevState) => [...prevState, { x, y, blockId }]);

      const shipCoordinates = getShipCoordinates(
        user?.inventoryBlocks.find((block) => block.id === blockId)!.blockType!,
        { x, y }
      );

      const shipColor = user?.inventoryBlocks.find((block) => block.id === blockId)!.colorHex!;

      // eslint-disable-next-line no-restricted-syntax
      for (const { x: xs, y: ys } of shipCoordinates) {
        setBlockPlacements((prevState) => ({
          ...prevState,
          [`${xs}${ys}`]: shipColor,
        }));
      }
    },
    [setPlacements, placements]
  );

  // if user lands on this page, stake isn't set
  if (!state?.stake) {
    navigate('/');

    setNotification({
      title: 'stake-error',
      description: 'stake must be set',
    });

    return <></>;
  }

  return (
    <div className="new-game page-container">
      <div className="page-container__title">
        <div className="page-container__title__value">you vs {state?.owner ?? '???'}</div>
      </div>
      <div className="page-container__content">
        <div className="game-board">
          {EMPTY_BOARD.map((boardRow) => (
            <div key={boardRow[0].y} className="game-board__row">
              {boardRow.map((boardCell) => (
                <DropTarget key={`${boardCell.x}${boardCell.y}`} onDrop={addPlacement} x={boardCell.x} y={boardCell.y}>
                  <Cell colorHex={blockPlacements[`${boardCell.x}${boardCell.y}`]} isHit={null} />
                </DropTarget>
              ))}
            </div>
          ))}
          <div className="game-board__placement">
            <div className="game-board__placement__title">pick&&place?10-blocks</div>
            <div className="game-board__placement__inventory">
              {user?.inventoryBlocks
                .filter((block) => block.active)
                .map((block) => (
                  <DraggableComponent key={block.id} blockId={block.id}>
                    <Block block={block} />
                  </DraggableComponent>
                ))}
            </div>
            <div className="game-board__placement__submit" onClick={() => createMatch()}>
              confirm block placement &gt;&gt;
            </div>
          </div>
        </div>
        <div className="delimiter" />
        <div className="game-board">{isJoin ? 'place blocks and confirm' : 'waiting for opponent...'}</div>
      </div>
    </div>
  );
}
