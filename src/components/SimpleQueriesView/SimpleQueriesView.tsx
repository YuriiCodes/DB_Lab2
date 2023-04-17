import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {UserType} from "~/components/UsersCrudTable/UsersCrudTable";
import {SalaryType} from "~/components/SalaryCrudTable/SalaryCrudTable";
import {api} from "~/utils/api";
import toast from "react-hot-toast";
import {ProjectType} from "~/components/ProjectsCrudTable/ProjectsCrudTable";
import {TaskType} from "~/components/TaskCrudTable/TaskCrudTable";


const FirstQuery = (props: { projects: ProjectType[] }) => {
    const [selectProjectIdValue, setSelectProjectIdValue] = useState("");
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const {mutate} = api.queries.getTasksByProjectId.useMutation({
        onSuccess: (data) => {
            setTasks(data);
        },
        onError: (error) => {
            toast.error("Something went wrong during fetching");
        }
    });
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`1. Get all the tasks assigned to a specific project:`}</h3>
            {/*    render a select from material ui to select the user ID:*/}
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Project</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectProjectIdValue}
                    label="Project"
                    onChange={(e) => {
                        setSelectProjectIdValue(e.target.value);
                        mutate({
                            projectId: Number(e.target.value)
                        });
                    }
                    }
                >
                    {props.projects.map((project) => {
                        return <MenuItem key={project.id} value={project.id}>{project.name}
                        </MenuItem>
                    })}

                </Select>
            </FormControl>
            {(tasks && tasks.length > 0) && <Box>
                <h4>Tasks:</h4>
                <ul>
                    {tasks.map((task) => {
                        return <li key={task.id}>{task.title}
                        </li>
                    })}
                </ul>
            </Box>}
            {(!tasks || tasks.length === 0) && <Box>
                <h4>No tasks found for the given project</h4>
            </Box>
            }
        </Box>
    )
}

const SecondQuery = (props: { projects: ProjectType[] }) => {
    const {mutate} = api.queries.getUsersByProjectId.useMutation({
        onSuccess: (data) => {
            setUsers(data);
        },
        onError: (error) => {
            toast.error("Something went wrong during fetching");
        }
    })
    const [selectProjectIdValue, setSelectProjectIdValue] = useState("");
    const [users, setUsers] = useState<UserType[]>([]);

    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`2. Get all the users assigned to a specific project:`}</h3>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Project</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectProjectIdValue}
                    label="Project"
                    onChange={(e) => {
                        setSelectProjectIdValue(e.target.value);
                        mutate({
                            projectId: Number(e.target.value)
                        });
                    }
                    }
                >
                    {props.projects.map((project) => {
                        return <MenuItem key={project.id} value={project.id}>{project.name}
                        </MenuItem>
                    })}

                </Select>
            </FormControl>
            {(users && users.length > 0) && <Box>
                <h4>Project members:</h4>
                <ul>
                    {users.map((user) => {
                        return <li key={user.id}>{user.username}
                        </li>
                    })}
                </ul>
            </Box>}
            {(!users || users.length === 0) && <Box>
                <h4>No members found for the given project</h4>
            </Box>
            }
        </Box>
    )

}

const ThirdQuery = (props: { users: UserType[] }) => {
    const [selectUserIdValue, setSelectUserIdValue] = useState("");
    const [salary, setSalary] = useState<SalaryType[]>([]);
    const {mutate} = api.queries.getSalaryByUserId.useMutation({
        onSuccess: (data) => {
            setSalary(data);
        },
        onError: (error) => {
            toast.error("Something went wrong during fetching");
        }
    })

    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`3. Get the salary of a specific user:`}</h3>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">User</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectUserIdValue}
                    label="User"
                    onChange={(e) => {
                        setSelectUserIdValue(e.target.value);
                        mutate({
                            userId: Number(e.target.value)
                        });
                    }
                    }
                >
                    {props.users.map((user) => {
                        return <MenuItem key={user.id} value={user.id}>{user.username}
                        </MenuItem>
                    })}
                </Select>
            </FormControl>
            {(salary && salary.length > 0) && <Box>
                <h4>User salary:</h4>
                <ul>
                    {salary.map((sal) => {
                        return <li key={sal.id}>{sal.amount}
                        </li>
                    })}
                </ul>
            </Box>}
            {(!salary || salary.length === 0) && <Box>
                <h4>No salary for the given user</h4>
            </Box>
            }

        </Box>
    )
}

const FourthQuery = (props: { users: UserType[] }) => {
    const [selectUserIdValue, setSelectUserIdValue] = useState("");
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const {mutate} = api.queries.getTasksByUserId.useMutation({
        onSuccess: (data) => {
            setTasks(data);
        },
        onError: (error) => {
            toast.error("Something went wrong during fetching");
        }
    })
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`4. Get all the tasks assigned to a specific user:`}</h3>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">User</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectUserIdValue}
                    label="User"
                    onChange={(e) => {
                        setSelectUserIdValue(e.target.value);
                        mutate({
                                userId: Number(e.target.value)
                            }
                        )
                    }}
                >
                    {props.users.map((user) => {
                        return <MenuItem key={user.id} value={user.id}>{user.username}
                        </MenuItem>
                    })}
                </Select>
            </FormControl>

            {(tasks && tasks.length > 0) && <Box>
                <h4>User tasks:</h4>
                <ul>
                    {tasks.map((task) => {
                        return <li key={task.id}>{task.title}
                        </li>
                    })}
                </ul>
            </Box>}
            {(!tasks || tasks.length === 0) && <Box>
                <h4>No tasks assigned for the given user</h4>
            </Box>
            }
        </Box>
    )
}

const FifthQuery = (props: { projects: ProjectType[] }) => {
    const [selectProjectIdValue, setSelectProjectIdValue] = useState("");
    const [owner, setOwner] = useState<UserType>({} as UserType);
    const {mutate} = api.queries.getOwnerByProjectId.useMutation({
        onSuccess: (data) => {
            if(data) {
                setOwner(data);
            }
        },
        onError: (error) => {
            toast.error("Something went wrong during fetching");
        }
    })
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`5. Get the owner of a specific project:`}</h3>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Project</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectProjectIdValue}
                    label="Project"
                    onChange={(e) => {
                        setSelectProjectIdValue(e.target.value);
                        mutate({
                            projectId: Number(e.target.value)
                        });
                    }
                    }
                >
                    {props.projects.map((project) => {
                        return <MenuItem key={project.id} value={project.id}>{project.name}
                        </MenuItem>
                    })}

                </Select>
            </FormControl>

            {(owner ) && <Box>
                <h4>Project owner:</h4>
                <ul>
                    <li>{owner.username || "No owner"}</li>
                </ul>
            </Box>}
            {(!owner) && <Box>
                <h4>No owner found for the given project</h4>
            </Box>
            }
        </Box>
    )
}

interface SimpleQueriesView {
    users: UserType[];
    salary: SalaryType[];
    projects: ProjectType[];
}

export const SimpleQueriesView = ({users, salary, projects}: SimpleQueriesView) => {
    return (
        <Box>
            <FirstQuery projects={projects}/>
            <SecondQuery projects={projects}/>
            <ThirdQuery users={users}/>
            <FourthQuery users={users}/>
            <FifthQuery projects={projects}/>
        </Box>

    )
}