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
    DialogTitle,
    IconButton, Select,
    Stack,
    TextField,
    Tooltip,
    MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {type inferRouterOutputs} from "@trpc/server";
import {type AppRouter} from "~/server/api/root";
import {api} from "~/utils/api";
import toast from "react-hot-toast";
import {type UserType} from "~/components/UsersCrudTable/UsersCrudTable";


type RouterOutput = inferRouterOutputs<AppRouter>;
export type SalaryType = RouterOutput["salary"]["getAll"][0];

type SalaryCrudTableProps = {
    data: SalaryType[];
    users: UserType[];
}
const SalaryCrudTable = ({data, users}: SalaryCrudTableProps) => {
    const ctx = api.useContext();

    const {mutate: createSalary} = api.salary.create.useMutation({
        onSuccess: () => {
            void ctx.salary.invalidate();
            toast.success("Salary created successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to add new salary! Please try again later.");
            }
        }
    });

    const {mutate: updateSalary} = api.salary.update.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("Salary updated successfully!");
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to update the salary! Please try again later.");
            }
        }
    });

    const {mutate: deleteSalary} = api.salary.delete.useMutation({
        onSuccess: () => {
            void ctx.users.invalidate();
            toast.success("Salary deleted successfully!");
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
    const [tableData, setTableData] = useState<SalaryType[]>(data || []);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const userIdsThatDoNotHaveSalary = useMemo(() => {
        const userIdsThatHaveSalary = tableData.map((salary) => salary.userId);
        return users.filter((user) => !userIdsThatHaveSalary.includes(user.id)).map((user) => user.id);
    }, [tableData, users]);


    const handleCreateNewRow = (values: Omit<SalaryType, 'id'>) => {
        createSalary(values);
        tableData.push({...values, id: tableData.length + 1});
        setTableData([...tableData]);
    };

    const handleSaveRowEdits: MaterialReactTableProps<SalaryType>['onEditingRowSave'] =
        // eslint-disable-next-line @typescript-eslint/require-await
        async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {

                // send || receive api updates here,
                // then refetch or update local table data for re-render
                updateSalary({...values, id: Number(values.id)})
                tableData[row.index] = values;
                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row: MRT_Row<SalaryType>) => {
            if (
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                !confirm(`Are you sure you want to delete the row with the ID :${row.getValue('id')}?`)
            ) {
                return;
            }
            //send api delete request here, then re-fetch or update local table data for re-render
            deleteSalary({
                id: row.getValue('id')
            });
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<SalaryType>,
        ): MRT_ColumnDef<SalaryType>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    let isValid = true;
                    switch (cell.column.id) {
                        case 'amount':
                            if (!validateSalary(Number(event.target.value))) {
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

    const columns = useMemo<MRT_ColumnDef<SalaryType>[]>(
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
                accessorKey: 'userId',
                header: 'User ID',
                enableEditing: false,
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'amount',
                header: 'Salary amount',
                size: 140,
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
                        add new salary
                    </Button>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
                users={users}
                userIdsThatDoNotHaveSalary={userIdsThatDoNotHaveSalary}
            />
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<SalaryType>[];
    onClose: () => void;
    onSubmit: (values: Omit<SalaryType, 'id'>) => void;
    open: boolean;
    users: UserType[];
    userIdsThatDoNotHaveSalary: number[];
}


type newSalaryValues = {
    userId: number;
    amount: number;
}
export const CreateNewAccountModal = ({
                                          open,
                                          columns,
                                          onClose,
                                          onSubmit,
                                          users,
                                          userIdsThatDoNotHaveSalary,
                                      }: CreateModalProps) => {
        const [selectValue, setSelectValue] = useState("");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const [values, setValues] = useState<newSalaryValues>(() =>
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
            if (!validateSalary(values.amount)) {
                toast.error('Salary amount is invalid');
                return;
            }

            onSubmit({
                userId: Number(values.userId),
                amount: Number(values.amount),
            });
            console.log(values)
            onClose();
        };

        return (
            <Dialog open={open}>
                <DialogTitle textAlign="center">Create new salary</DialogTitle>
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
                                if (column.accessorKey === 'userId') {
                                    return <FormControl fullWidth key={column.accessorKey}>
                                        <InputLabel id="demo-simple-select-label">User</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectValue}
                                            label="User"
                                            onChange={(e) => {
                                                setSelectValue(e.target.value);
                                                setValues({...values, userId: Number(e.target.value)})
                                            }
                                            }
                                        >
                                            {/*    Render only users with IDs from userIdsThatDoNotHaveSalary:*/}
                                            {users.filter(user => userIdsThatDoNotHaveSalary.includes(user.id)).map(user => (
                                                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
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
                        Create New Account
                    </Button>
                </DialogActions>
            </Dialog>
        )
            ;
    }
;

const validateRequired = (value: string) => !!value.length;


const validateSalary = (value: number) => {
    if (value < 0) {
        return false;
    }
    return true;
}


export default SalaryCrudTable;
