import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { useEffect } from "react";
import { getBoardsAsync } from "../redux/boardsSlice";

const BoardsAll = () => {

  const history = useHistory();

  const dispatch = useDispatch();

  const boards = useSelector(state => state.boards);

  useEffect(() => {
    dispatch(getBoardsAsync());
  }, [dispatch]);

  const boardClickHandler = (id) => (event) => {
    history.push(`/board/${id}`);
  };

  const newBoardClickHandler = () => {
    console.log('Adding new board!');
  };

  const renderBoards = () => {

    return (
      <div className="row">
        
        {boards.map((board) => {
          return (
            <div className="col-md-4 d-flex justify-content-center" key={board._id}>
              <div className="board-comp d-flex align-items-center justify-content-center" onClick={boardClickHandler(board._id)}>
                <h2>
                  {board.name}
                </h2>
              </div>
            </div>
          )
        })}
      

        <div className="col-md-4 d-flex justify-content-center">
          <div className="new-board-comp d-flex align-items-center justify-content-center" onClick={newBoardClickHandler}>
              <h2>
                <strong>+ </strong>Add board
              </h2>
          </div>
        </div>
    
      </div>
    )
  };

  return (
      <div>
        {renderBoards()}
      </div>
  );
}

export default BoardsAll