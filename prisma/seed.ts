import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
//     Seed. Create:
//     5 users,
//     5 salaries
//     5 projects,

//     20 tasks(2 for each iteration, 4 per one project),

    for (let i = 0; i < 5; i++) {
        await prisma.user.create({
            data: {
                email: `user${i}@gmail.com`,
                password: `password${i}`,
                username: `User${i}`,
            },
        })
        await prisma.salary.create({
            data: {
                userId: i + 1,
                amount: Math.floor(Math.random() * 1000),
            }
        })

        await prisma.project.create({
                data: {
                    name: `Project${i}`,
                    description: `Description${i}`,
                    joinCode: `JoinCode${i}`,
                    ownerId: i + 1,
                }
            }
        )

        await prisma.projectMember.create({
            data: {
                userId: i + 1,
                projectId: i + 1,
            }
        })

    }

    //     10 iterations(2 for each project),
    for (let i = 0; i < 10; i++) {
        await prisma.iteration.create({
            data: {
                name: `Iteration${i}`,
                description: `Description${i}`,
                projectId: i % 2 + 1,
            }
        })
    }

    //     20 tasks(2 for each iteration, 4 per one project),
    for (let i = 0; i < 20; i++) {
        await prisma.task.create({
            data: {
                iterationId: i % 2 + 1,
                points: Math.floor(Math.random() * 100),
                title: `Task${i}`,
                description: `Description${i}`,
                status: 'TODO',
                creatorId: i % 5 + 1,
                executorId: i % 5 + 1,
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })