import request from '@/utils/request'

export function sendMessage(boardCode, data) {
    return request({
        url: '/groupMsg/send',
        method: 'post',
        data: { boardCode, data }
    })
};