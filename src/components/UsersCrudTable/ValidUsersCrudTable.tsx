import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {type inferRouterOutputs} from "@trpc/server";
import {type AppRouter} from "~/server/api/root";
import {api} from "~/utils/api";
import toast from "react-hot-toast";


type RouterOutput = inferRouterOutputs<AppRouter>;
export type UserType = RouterOutput["users"]["getAll"][0];

const ValidUsersCrudTable = () => {
    const ctx = api.useContext();

    const {data, isLoading, isError} = api.users.getAll.useQuery();
    const {mutate: createUser} = api.users.create.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("User created successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to add new user! Please try again later.");
            }
        }
    });

    const {mutate: updateUser} = api.users.update.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("User updated successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to update the user! Please try again later.");
            }
        }
    });

    const {mutate: deleteUser} = api.users.delete.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("User deleted successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to delete new user! Please try again later.");
            }
        }
    });
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<UserType[]>(data || []);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const handleCreateNewRow = (values: Omit<UserType, 'id'>) => {
        createUser(values);
        tableData.push({...values, id: tableData.length + 1});
        setTableData([...tableData]);
    };

    const handleSaveRowEdits: MaterialReactTableProps<UserType>['onEditingRowSave'] =
        // eslint-disable-next-line @typescript-eslint/require-await
        async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {

                // send || receive api updates here,
                // then refetch or update local table data for re-render
                updateUser({...values, id: Number(values.id)})
                tableData[row.index] = values;
                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row: MRT_Row<UserType>) => {
            if (
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                !confirm(`Are you sure you want to delete ${row.getValue('username')}`)
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render


            deleteUser({
                id: row.getValue('id')
            });
            // tableData.splice(row.index, 1);
            // setTableData([...tableData]);
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<UserType>,
        ): MRT_ColumnDef<UserType>['muiTableBodyCellEditTextFieldProps'] => {
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

    const columns = useMemo<MRT_ColumnDef<UserType>[]>(
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
                accessorKey: 'username',
                header: 'User Name',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'password',
                header: 'Password',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: 'email',
                }),
            },
        ],
        [getCommonEditTextFieldProps],
    );

    useEffect(() => {
        setTableData(data || []);
    }, [
        isLoading,

    ])
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;

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
                        Create New User
                    </Button>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<UserType>[];
    onClose: () => void;
    onSubmit: (values: Omit<UserType, 'id'>) => void;
    open: boolean;
}


type newAccountValues = {
    username: string;
    password: string;
    email: string;
}
export const CreateNewAccountModal = ({
                                          open,
                                          columns,
                                          onClose,
                                          onSubmit,
                                      }: CreateModalProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [values, setValues] = useState<newAccountValues>(() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        columns.reduce((acc, column) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            acc[column.accessorKey ?? ''] = '';
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return acc;
        }, {} as any),
    );

    const handleSubmit = () => {
        // Perform values validate here

        // Check if values.email is email:
        if (!validateEmail(values.email)) {
            toast.error('Email is not valid');
            return;
        }

        // Check if values.username is username:
        if (!validateUsername(values.username)) {
            toast.error('Username is not valid. It must be from 3 to 20 characters, and not include special characters like whitespace');
            return;
        }

        // Check if values.password is password:
        if (!validatePassword(values.password)) {
            toast.error('Password is not valid. It must be from 8 to 20 characters');
            return;
        }
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
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
                    Create New Account
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


export default ValidUsersCrudTable;
