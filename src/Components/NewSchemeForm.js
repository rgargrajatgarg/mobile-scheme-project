import {Form,Button,Row,Col,Modal} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import { model } from '../shared/model_data';
import { SheetJSFT } from '../shared/file_types';
import { make_cols } from './MakeColumns';
import axios from "axios";
import XLSX from 'xlsx';
import {useHistory} from "react-router-dom";
// var Multiselect = require('react-bootstrap-multiselect');


function RenderPriceCondition(){
    return (
        <Form.Group className="mb-3" controlId="formBasicOperator">
            <Form.Label>Select the Condition</Form.Label>
            <Row>
                <Col md={2} xs={2}>
                    <Form.Control
                    as="select">
                    <option value=">=">{">="}</option>
                    <option value="=">=</option>
                    <option value="<=">{"<="}</option>
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control type="number" name="condValue" placeholder="Enter Condition Value" />
                </Col>
            </Row>  
        </Form.Group>
    )
}
function RenderModelCondition(){
   
    //mobile model condition allow
    return(
        <div></div>
    )
}
function RenderCondition(props){
    if(props.condType==="No"){
        return (<div></div>)
    }
    else if(props.condType==="Price_Condition"){
        return <RenderPriceCondition />
    }
    else if(props.condType==="Model_Condition"){
        return <RenderModelCondition />
    }
    else {return(<div></div>);}
}
function NewSchemeForm(){
    
    const [condType,setCondType] = useState();
    const [file,setFile] = useState();
    const [fileHeader,setFileHeader] = useState();
    const [userHeader,setUserHeader] = useState({
        date: '',
        model: '',
        price: ''
    });
    const [modelShow,setModelShow] = useState();
    const [schemeName,setSchemeName] = useState();
    const [dateColumn,setDateColumn] = useState();
    const [userHeaderSubmit,setUserHeaderSubmit] = useState();
    const history = useHistory();
    var fileHeaderOptions;
    useEffect(() => {
        setCondType("No");
        setFile(null);
        setFileHeader(null);
        setModelShow(false);
      }, []);
    if(fileHeader) fileHeaderOptions = fileHeader.map((head)=>{return (<option key = {head} value={head}>{head}</option>)});

    function   handleActivationFileChange(e) {
        const files = e.target.files;
        if (files && files[0]) {
            console.log(files[0]);
            setFile(files[0]);
        }
    };
    function   handleActivationUpload(e) {
        e.preventDefault();
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        // console.log(file);
        try{
            reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {
                type: rABS ? 'binary' : 'array',
                bookVBA: true,
            });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            //   console.log(JSON.stringify(data, null, 2));
            const dataJSON = JSON.stringify(data, null, 2);
            setFileHeader(Object.keys(data[0]));
            setModelShow(true);
            //   this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                
            //   });
            };
            if (rABS) {
            console.log('rABS');
            reader.readAsBinaryString(file);
            } else {
            reader.readAsArrayBuffer(file);
            }
        }
        catch{
            alert("Please select Valid file");
        }
      }
    function handleUserHeaderSubmit(e){
        console.log(e);
        setUserHeaderSubmit(true);
        setModelShow(false);
        return(<div></div>);
    }
    function handleUserHeaderChange(e){
        // if(e.target.name === 'date'){
        //     var currState = userHeader;
        //     currState.date = e.target.value;
        //     setUserHeader(currState);
        // }
        // else if(e.target.name === 'model'){
        //     var currState = userHeader;
        //     currState.model = e.target.value;
        //     setUserHeader(currState);      
        // }
        // else if(e.target.name === 'price'){
        //     var currState = userHeader;
        //     currState.price = e.target.value;
        //     setUserHeader(currState);      
        // }
        // else {}
        console.log("yaayy");
    }
    async function handleAddScheme(event) {
        event.preventDefault();
        try{
           const createTask = await axios.post(`http://localhost:3000/scheme/`, {
                 name: event.target.schemeName.value,
                 start_date: event.target.startDate.value,
                 end_date: event.target.endDate.value,
                 condition_type: event.target.condType.value
           });
           alert('Scheme ' + event.target.schemeName.value + ' added succesfully');
           history.push("/");
        }
        catch(e){
           console.log(e);
           alert(e.message);
        }
       //  alert("States added successfully");
       //  fetchStateData();
   }
    return(
    <div className = "container">
        <div className="row">
            <div className="col-md-4">
            <p>Please select the Activation file first, then add the scheme details below</p>
            <Form>
            <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Input Excel file</Form.Label>
                    <Form.Control type="file" accept={SheetJSFT} onChange={handleActivationFileChange}/>
                    <input type="submit" value="Upload the file" onClick={handleActivationUpload} />
            </Form.Group>
            </Form>
        <Form onSubmit={handleAddScheme}>
        <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Scheme Name</Form.Label>
            <Form.Control type="name" name="schemeName" placeholder="Enter Scheme Name" />
            <Form.Text className="text-muted">
            Create a new name for scheme to help you track later on
            </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="start_date">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" name="startDate" placeholder="Scheme Start Date" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="end_date">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" name="endDate" placeholder="Scheme End Date" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCondType">
            <Form.Label>Select Condition Type</Form.Label>
            <Form.Control
            as="select"
            name="condType"
            value={condType}
            onChange={e => {
                console.log("e.target.value", e.target.value);
                setCondType(e.target.value);
            }}
            >
            <option value="No">No Condition</option>
            <option value="Price_Condition">Price Condition</option>
            <option value="Model_Condition">Model Condition</option>
            </Form.Control>
        </Form.Group>
        <RenderCondition condType={condType} />

        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>

        <Modal show={modelShow}>
            <Modal.Header>
              <Modal.Title>Please Select the Correct Attributes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="date_column">
                        <Form.Label>Date Column</Form.Label>
                        <Form.Control as="select" name="date" onChange = {(e) => handleUserHeaderChange(e)}>
                        {fileHeaderOptions}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="model_column">
                        <Form.Label>Model Column</Form.Label>
                        <Form.Control as="select" name = "Model" onChange = {(e) => handleUserHeaderChange(e)}>
                        {fileHeaderOptions}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Price_column">
                        <Form.Label>Price Column</Form.Label>
                        <Form.Control as="select" name ="Price" onChange = {(e) => handleUserHeaderChange(e)}>
                        {fileHeaderOptions}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="Submit" onClick = {(e) => handleUserHeaderSubmit(e)}>
                Submit 
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        </div>
    </div>)
}
export default NewSchemeForm;