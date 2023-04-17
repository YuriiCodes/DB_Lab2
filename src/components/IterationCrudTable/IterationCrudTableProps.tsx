import React, {useCallback, useMemo, useState} from 'react';
import MaterialReactTable, {
    type MaterialReactTableProps,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Row,
} from 'material-react-table';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    IconButton, InputLabel, MenuItem, Select,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {type inferRouterOutputs} from "@trpc/server";
import {type AppRouter} from "~/server/api/root";
import {api} from "~/utils/api";
import toast from "react-hot-toast";
import {type ProjectType} from "~/components/ProjectsCrudTable/ProjectsCrudTable";


type RouterOutput = inferRouterOutputs<AppRouter>;
export type IterationType = RouterOutput["iteration"]["getAll"][0];


type IterationCrudTableProps = {
    data: IterationType[];
    projects: ProjectType[];
}
const IterationCrudTable = ({data, projects}: IterationCrudTableProps) => {
    const ctx = api.useContext();

    const {mutate: createProject} = api.iteration.create.useMutation({
        onSuccess: () => {
            void ctx.projects.invalidate();
            toast.success("Iteration created successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to create new iteration! Please try again later.");
            }
        }
    });

    const {mutate: updateIteration} = api.iteration.update.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("Iteration updated successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to update the iteration! Please try again later.");
            }
        }
    });

    const {mutate: deleteProject} = api.iteration.delete.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("Iteration deleted successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to delete the iteratoin! Please try again later.");
            }
        }
    });
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<IterationType[]>(data || []);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const handleCreateNewRow = (values: Omit<IterationType, 'id'>) => {
        createProject({
            ...values,
            projectId: Number(values.projectId)
        });
        tableData.push({...values, id: tableData.length + 1});
        setTableData([...tableData]);
    };

    const handleSaveRowEdits: MaterialReactTableProps<IterationType>['onEditingRowSave'] =
        // eslint-disable-next-line @typescript-eslint/require-await
        async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {

                // send || receive api updates here,
                // then refetch or update local table data for re-render
                updateIteration({
                    ...values,
                    projectId: Number(values.projectId),
                    id: Number(values.id),
                })
                tableData[row.index] = values;
                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row: MRT_Row<IterationType>) => {
            if (
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                !confirm(`Are you sure you want to delete ${row.getValue('name')}?`)
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render


            deleteProject({
                id: Number(row.getValue('id'))
            });
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<IterationType>,
        ): MRT_ColumnDef<IterationType>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    let isValid = true;
                    switch (cell.column.id) {
                        case 'email':
                            if (!validateEmail(event.target.value)) {
                                isValid = false;
                            }
                            break;
                        case 'username':
                            if (!validateUsername(event.target.value)) {
                                isValid = false;
                            }
                            break;
                        case 'password':
                            if (!validatePassword(event.target.value)) {
                                isValid = false;
                            }
                            break;
                        default:
                            if (!validateRequired(event.target.value)) {
                                isValid = false;
                            }
                            break;
                    }
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} is required`,
                        });
                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );

    const columns = useMemo<MRT_ColumnDef<IterationType>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: 'name',
                header: 'Iteration Name',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'description',
                header: 'Iteration description',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'projectId',
                header: 'Project Id',
                enableEditing: false, //disable editing on this column
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            }
        ],
        [getCommonEditTextFieldProps],
    );
    return (
        <>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                columns={columns}
                data={tableData}
                editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                renderRowActions={({row, table}) => (
                    <Box sx={{display: 'flex', gap: '1rem'}}>
                        <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained"
                    >
                        Create New Iteration
                    </Button>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
                projects={projects}
            />
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<IterationType>[];
    onClose: () => void;
    onSubmit: (values: Omit<IterationType, 'id'>) => void;
    open: boolean;
    projects: ProjectType[];
}


type newIterationValues = {
    name: string;
    description: string;
    projectId: number;
}
export const CreateNewAccountModal = ({
                                          open,
                                          columns,
                                          onClose,
                                          onSubmit,
                                          projects,
                                      }: CreateModalProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [values, setValues] = useState<newIterationValues>(() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        columns.reduce((acc, column) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            acc[column.accessorKey ?? ''] = '';
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return acc;
        }, {} as any),
    );

    const [selectValue, setSelectValue] = useState("");

    const handleSubmit = () => {
        // Perform values validate here

        //validate project name
        if (!validateRequired(values.name)) {
            toast.error('Project name is required');
            return;
        }
        //validate project description
        if (!validateRequired(values.description)) {
            toast.error('Project description is required');
            return;
        }


        //validate project owner id
        if (!validateRequired(values.projectId.toString())) {
            toast.error('Project owner id is required');
            return;
        }

        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Iteration</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: {xs: '300px', sm: '360px', md: '400px'},
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => {
                            if (column.accessorKey === 'id') return null;
                            if (column.accessorKey === 'projectId') {
                                return <FormControl fullWidth key={column.accessorKey}>
                                    <InputLabel id="demo-simple-select-label">Project</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectValue}
                                        label="User"
                                        onChange={(e) => {
                                            setSelectValue(e.target.value);
                                            setValues({...values, projectId: Number(e.target.value)});
                                        }
                                        }
                                    >
                                        {projects.map(proj => (
                                            <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
                                        ))}


                                    </Select>
                                </FormControl>
                            }
                            return <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({...values, [e.target.name]: e.target.value})
                                }
                            />
                        })
                        }
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{p: '1.25rem'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Iteration
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;


//8 to 20 chars
const validatePassword = (password: string) =>
    !!password.length && password.length >= 8 && password.length <= 20;

const validateEmail = (email: string) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );


// From 3 to 20 characters, only letters, numbers, underscore and hyphen
const validateUsername = (username: string) =>
    !!username.length &&
    username.match(/^[a-zA-Z0-9_-]{3,20}$/);


export default IterationCrudTable;
