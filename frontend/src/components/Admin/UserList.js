import React , { Fragment , useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import "./ProductList.css";
import { useSelector , useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import { Button } from '@material-ui/core';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { useAlert } from "react-alert";
import { getAllUsers , deleteUser , clearErrors } from '../../actions/userAction';
import { DELETE_USER_RESET } from "../../constants/userConstant"

const UserList = ({history}) => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { error , users } = useSelector(state => state.allUsers);
    const { error: deleteError , message , isDeleted  } = useSelector(state => state.profile);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors);
        }

        if(deleteError){
            alert.error(error);
            dispatch(clearErrors);
        }

        if(isDeleted){
          alert.success(message);
          history.push("/admin/users");
          dispatch({type: DELETE_USER_RESET})
        }

        dispatch(getAllUsers());
    }, [dispatch , error , alert , history , isDeleted , deleteError , message ])

    const columns = [
    { field: "id", headerName: "User ID", minWidth: 160, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 170,
      flex: 0.6,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
      });
    });



    return (
        <Fragment>
            <MetaData title={`All Users - Admin`} />

            <div className='dashboard'>
                <SideBar />
                <div className='productListContainer'>
                    <h1 id="productListHeading" >All Users</h1>

                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    )
}

export default UserList
