import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {UserType} from "~/components/UsersCrudTable/UsersCrudTable";
import {SalaryType} from "~/components/SalaryCrudTable/SalaryCrudTable";
import {api} from "~/utils/api";
import toast from "react-hot-toast";
import {ProjectType} from "~/components/ProjectsCrudTable/ProjectsCrudTable";


const FirstQuery = (props: { projects: ProjectType[] }) => {
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`1. Find all users who have a salary greater than a specific amount, and who are assigned to at least one
                task with a status of "done":`}</h3>
        </Box>
    )
}

const SecondQuery = (props: { projects: ProjectType[] }) => {
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`2. Find all projects that have more than a specific number of iterations, and that have at least one
                user assigned to them:`}
            </h3>
        </Box>
    )

}

const ThirdQuery = (props: { users: UserType[] }) => {

    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`3. Find all users who are assigned to at least one task with a status of 'DONE', and who are also
                assigned to at least one task with a status of 'IN_PROGRESS':`}</h3>
        </Box>
    )
}

const FourthQuery = (props: { users: UserType[] }) => {
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>{`4. Find all projects that have at least one user assigned to them, and where the sum of all task points
                is greater than a specific amount:`}</h3>
        </Box>
    )
}

const FifthQuery = (props: { projects: ProjectType[] }) => {
    const [selectProjectIdValue, setSelectProjectIdValue] = useState("");
    const [owner, setOwner] = useState<UserType>({} as UserType);
    const {mutate} = api.queries.getOwnerByProjectId.useMutation({
        onSuccess: (data) => {
            if (data) {
                setOwner(data);
            }
        },
        onError: (error) => {
            toast.error("Something went wrong during fetching");
        }
    })
    return (
        <Box sx={{border: 1, borderColor: "grey.500", p: 2, m: 2}}>
            <h3>5. Get the owner of a specific project:</h3>
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

            {(owner) && <Box>
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

export const ComplexQueriesView = ({users, salary, projects}: SimpleQueriesView) => {
    return (
        <Box>
            <FirstQuery projects={projects}/>
            <SecondQuery projects={projects}/>
            <ThirdQuery users={users}/>
            <FourthQuery users={users}/>
        </Box>

    )
}