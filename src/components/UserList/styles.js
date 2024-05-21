import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  fab1: {
    width : '30px',
    height: '30px',
    border: 'none',
    borderRadius : '50%',
    background : 'green',
    display:'flex',
    justifyContent : 'center',
    alignItems:'center',
    fontSize:'20px',
    color :'white',
    marginRight : '5px'
  },
  fab2: {
    width : '30px',
    height: '30px',
    border: 'none',
    borderRadius : '50%',
    background : 'red',
    display:'flex',
    justifyContent : 'center',
    alignItems:'center',
    fontSize:'20px',
    color :'white'
  },
  viewphoto : {
    textAlign : 'center',
    width : '100%'
  },
  modal1 :{
    zIndex : 10000000000000,
  },
  link :{
    textDecoration : 'none',
    color: 'black'
  }
}));
