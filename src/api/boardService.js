import request from '@/utils/request'

export function getBoardPage(pageNo, pageSize, query) {
  return request({
    url: '/groupBoard/list',
    method: 'get',
    params: { pageNo, pageSize, query }
  })
};

export function findBoard(boardCode) {
  return request({
    url: '/groupBoard/' + boardCode,
    method: 'get'
  })
};

export function createBoard(board) {
  return request({
    url: '/groupBoard/create',
    method: 'post',
    data: board
  })
};

export function modifyBoard(board) {
  return request({
    url: '/groupBoard/modify',
    method: 'post',
    data: board
  })
};

export function removeBoard(boardCode) {
  return request({
    url: '/groupBoard/remove',
    method: 'post',
    params: { boardCode }
  })
};


export function getGroupBoardCnt() {
  return request({
    url: '/groupBoard/cnt',
    method: 'get'
  })
};