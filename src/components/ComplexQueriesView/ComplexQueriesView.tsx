import {Box, Button, FormControl, TextField} from "@mui/material";
import React, {useState} from "react";
import {UserType} from "~/components/UsersCrudTable/UsersCrudTable";
import {api} from "~/utils/api";
import toast from "react-hot-toast";
import {ProjectType} from "~/components/ProjectsCrudTable/ProjectsCrudTable";


const FirstQuery = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const {mutate: getUsersInAllProjects} = api.queries.getUsersInAllProjects.useMutation({
        onSuccess: (data) => {
            if (data) {
                setUsers(data);
            }
        },
        onError: (error) => {
            toast.error("Error executing query");
            setError(error.message || "Error executing query");
        }

    })


    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`1. Find users involved in all available projects.":`}</h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <Button onClick={() => {
                    getUsersInAllProjects()
                }}>Execute query </Button>
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
            {error && <Box> {error} </Box>}
            {(!users || users.length === 0) && <Box>
                <h4>No users found matching the following criteria.</h4>
            </Box>}
        </Box>
    )
}

const SecondQuery = () => {
    const [emailInputValue, setEmailInputValue] = useState("");
    const [users, setUsers] = useState<UserType[]>([]);
    const {mutate: getUsersInSameProjectsByEmail} = api.queries.getUsersInSameProjectsByEmail.useMutation({
        onSuccess: (data) => {
            if (data) {
                setUsers(data);
            }
        },
        onError: (error) => {
            toast.error(`Error executing query: ${error.message} `);
        }
    })

    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`2. Find usernames of the users that work on the same projects as a specific user (defined by email):`}
            </h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    id="outlined-controlled"
                    label="User Email"
                    type={"email"}
                    value={emailInputValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmailInputValue(event.target.value);
                    }}
                />
                <Button onClick={() => {
                    getUsersInSameProjectsByEmail({email: emailInputValue})
                }
                }>Execute query
                </Button>
            </FormControl>

            {(users && users.length > 0) && <Box>
                <h4>Users: </h4>
                <ul>
                    {users.map((user) => {
                        return <li key={user.id}>{user.username}
                        </li>
                    })}
                </ul>
            </Box>}

            {(!users || users.length === 0) && <Box>
                <h4>No users found working on the same projects.</h4>
            </Box>}
        </Box>
    )
}


const ThirdQuery = () => {
    const [emailInputValue, setEmailInputValue] = useState("");
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const {mutate: getProjectsBySalary} = api.queries.getProjectsBySalary.useMutation({
        onSuccess: (data) => {
            if (data) {
                setProjects(data);
            }
        },
        onError: (error) => {
            toast.error("Error executing query");
        }
    });

    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`3. Find all projects where all the employees have salary greater or equal than the user with the given email:`}
            </h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    id="outlined-controlled"
                    label="User Email"
                    type={"text"}
                    value={emailInputValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmailInputValue(event.target.value);
                    }}
                />
                {emailInputValue && <Button onClick={() => {
                    getProjectsBySalary({email: emailInputValue})
                }
                }>Execute query
                </Button>}
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


const FourthQuery = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [username, setUsername] = useState("");
    const {mutate: getUsersWhoParticipateInAllProjects} = api.queries.getUsersNotInUserProjects.useMutation({
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
            <h3>{` 4 Find all users who do not participate in any of the projects of the user with the specified username:`}
            </h3>

            <FormControl sx={{m: 1, minWidth: 120}}>
                <TextField
                    label={"Username"}
                    value={username}
                    sx={{m: 1, minWidth: 120}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUsername(e.target.value);
                    }}
                />
                {username && <Button onClick={() => {
                    getUsersWhoParticipateInAllProjects({username})
                }}>
                    Execute query
                </Button>

                }
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


export const ComplexQueriesView = () => {
    return (
        <Box>
            <FirstQuery/>
            <SecondQuery/>
            <ThirdQuery/>
            <FourthQuery/>
        </Box>

    )
}