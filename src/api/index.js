import { getUUID } from '@/utils/tool'

export const queryWaterfallList = ({pageSize =  10}) => {
    const result = {
        code: 200,
        data: []
    }
    
    for  (let i = 0; i < pageSize; i++) {
        const rendomWWidth =  (Math.floor(Math.random() * 2) + 4) * 100
        result.data.push({
            id: getUUID(),
            src: `https://picsum.photos/400/${rendomWWidth}`,
        })
    }
    return new  Promise((resolve, reject) => {
        resolve(result)
    })
}