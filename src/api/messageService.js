import request from '@/utils/request'

export function sendMessage(boardCode, data) {
    return request({
        url: '/message/send',
        method: 'post',
        data: { boardCode, data }
    })
};