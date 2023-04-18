import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import React, {useState} from "react";
import {UserType} from "~/components/UsersCrudTable/UsersCrudTable";
import {SalaryType} from "~/components/SalaryCrudTable/SalaryCrudTable";
import {api} from "~/utils/api";
import toast from "react-hot-toast";
import {ProjectType} from "~/components/ProjectsCrudTable/ProjectsCrudTable";
import {z} from "zod";


const FirstQuery = () => {
    const [numberInputValue, setNumberInputValue] = useState(1);
    const [users, setUsers] = useState<UserType[]>([]);

    const {mutate: getUsersBySalaryAndTaskStatus} = api.queries.getUsersBySalaryAndTaskStatus.useMutation({
        onSuccess: (data) => {
            if (data) {
                console.log(data);
                setUsers(data);
            }
        },
        onError: (error) => {
            toast.error("Error executing query");
        }
    })

    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`1. Find all users who have a salary greater than a specific amount, and who are assigned to at least one
                task with a status of "done":`}</h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    id="outlined-controlled"
                    label="Salary"
                    type={"number"}
                    value={numberInputValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setNumberInputValue(Number(event.target.value));
                    }}
                />
                <Button onClick={() => {
                    getUsersBySalaryAndTaskStatus({salary: numberInputValue})
                }
                }>Execute query
                </Button>
            </FormControl>
            {(users && users.length > 0) && <Box>
                <h4>Users:</h4>
                <ul>
                    {users.map((user) => {
                        return <li key={user.id}>{user.username}
                        </li>
                    })}
                </ul>
            </Box>}

            {(!users || users.length === 0) && <Box>
                <h4>No users found matching the following criteria.</h4>
            </Box>}
        </Box>
    )
}

const SecondQuery = () => {
    const [numberInputValue, setNumberInputValue] = useState(1);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const {mutate: getProjectsByIterationsAndUsers} = api.queries.getProjectsByIterationsAndUsers.useMutation({
        onSuccess: (data) => {
            if (data) {
                setProjects(data);
            }
        },
        onError: (error) => {
            toast.error("Error executing query");
        }
    })
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`2. Find all projects that have more than a specific number of iterations, and that have at least one
                user assigned to them:`}
            </h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    id="outlined-controlled"
                    label="Number of iterations"
                    type={"number"}
                    value={numberInputValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setNumberInputValue(Number(event.target.value));
                    }}
                />
                <Button onClick={() => {
                    getProjectsByIterationsAndUsers({iterationsNumber: numberInputValue})
                }
                }>Execute query
                </Button>
            </FormControl>

            {(projects && projects.length > 0) && <Box>
                <h4>Projects: </h4>
                <ul>
                    {projects.map((project) => {
                        return <li key={project.id}>{project.name}
                        </li>
                    })}
                </ul>
            </Box>}

            {(!projects || projects.length === 0) && <Box>
                <h4>No projects found matching the following criteria.</h4>
            </Box>}
        </Box>
    )

}

const ThirdQuery = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [firstStatus, setFirstStatus] = useState("");
    const [secondStatus, setSecondStatus] = useState("");


    const {mutate: getUsersByTwoTaskStatuses} = api.queries.getUsersByTasksStatus.useMutation({
        onSuccess: (data) => {
            if (data) {
                setUsers(data);
            }
        },
        onError: (error) => {
            toast.error("Error executing query");
        }
    })
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`3. Find all users who are assigned to at least one task with a status of 'DONE', and who are also
                assigned to at least one task with a status of 'IN_PROGRESS':`}</h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    label={"First status"}
                    value={firstStatus}
                    sx={{m: 1, minWidth: 120}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFirstStatus(e.target.value);
                    }}
                />
                <TextField
                    label={"Second status"}
                    value={secondStatus}
                    sx={{m: 1, minWidth: 120}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSecondStatus(e.target.value);
                    }}
                />

                <Button onClick={() => {
                    getUsersByTwoTaskStatuses({firstStatus, secondStatus})
                }}>
                    Execute query
                </Button>
            </FormControl>

            {(users && users.length > 0) && <Box>
                <h4>Users:</h4>
                <ul>
                    {users.map((user) => {
                        return <li key={user.id}>{user.username}
                        </li>
                    })}
                </ul>
            </Box>}

            {(!users || users.length === 0) && <Box>
                <h4>No users found matching the following criteria.</h4>
            </Box>}
        </Box>
    )
}

const FourthQuery = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [usersNumber, setUsersNumber] = useState(1);
    const [tasksPoints, setTasksPoints] = useState(1);
    const {mutate} = api.queries.getProjectsByUsersAndTasksPoints.useMutation({
        onSuccess: (data) => {
            if (data) {
                setProjects(data);
            }
        },
        onError: (error) => {
            toast.error("Error executing query");
        }
    })
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`4. Find all projects that have {input} users assigned to them, and where some task points
                is greater than a specific amount:`}</h3>
            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    label={"Users number"}
                    value={usersNumber}
                    type={"number"}
                    sx={{m: 1, minWidth: 120}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUsersNumber(Number(e.target.value));
                    }}
                />
                <TextField
                    label={"Tasks points"}
                    value={tasksPoints}
                    sx={{m: 1, minWidth: 120}}
                    type={"number"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTasksPoints(Number(e.target.value));

                    }
                }
                />

                <Button onClick={() => {
                    mutate({
                        usersNumber: usersNumber,
                        tasksPoints: tasksPoints,
                    })
                }}>

                    Execute query
                </Button>
            </FormControl>

            {(projects && projects.length > 0) && <Box>
                <h4>Projects: </h4>
                <ul>
                    {projects.map((project) => {
                        return <li key={project.id}>{project.name}
                        </li>
                    })}
                </ul>
            </Box>}

            {(!projects || projects.length === 0) && <Box>
                <h4>No projects found matching the following criteria.</h4>
            </Box>}
        </Box>
    )
}




export const ComplexQueriesView = () => {
    return (
        <Box>
            <FirstQuery />
            <SecondQuery/>
            <ThirdQuery />
            <FourthQuery/>
        </Box>

    )
}