// import { v4 as uuidv4 } from 'uuid';

export const getJobById = async ({id}: any) => {

    return await prisma.job.findUnique({
        where: {
            id: id
        }
    });
}

export const updateJob = async ({id, status, finishedAt, url}: any) => {

    return await prisma.job.update({
        where: {
            id: id
        },
        data: {
            status: status,
            finishedAt: finishedAt,
            url: url
        }
    })
}


export const createJob = async({ id, type, endpoint, status, format, startedAt, finishedAt, url}: any) => {

    // const id = uuidv4();

    return await prisma.job.create({
        data: {
            id: id,
            type: type,
            endpoint: endpoint,
            status: status,
            format: format,
            startedAt: startedAt,
            finishedAt: finishedAt,
            url: url
        } as any
    })
}