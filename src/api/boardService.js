import request from '@/utils/request'

export function getBoardPage(pageNo, pageSize, query) {
  return request({
    url: '/boards',
    method: 'get',
    params: { pageNo, pageSize, query }
  })
};

export function findBoard(boardCode) {
  return request({
    url: '/board/' + boardCode,
    method: 'get'
  })
};

export function createBoard(board) {
  return request({
    url: '/board/create',
    method: 'post',
    data: board
  })
};

export function modifyBoard(board) {
  return request({
    url: '/board/modify',
    method: 'post',
    data: board
  })
};

export function removeBoard(boardCode) {
  return request({
    url: '/board/remove',
    method: 'post',
    params: { boardCode }
  })
};
