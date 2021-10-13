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
                <Col md={2} xs={4}>
                    <Form.Control
                    as="select" name="priceOperator">
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
    const [schemeImage,setSchemeImage] = useState();
    const [fileHeader,setFileHeader] = useState();
    const [userHeader,setUserHeader] = useState({
        date: '',
        model: '',
        price: ''
    });
    const [excelJSON,setExcelJSON] = useState();
    const [modelShow,setModelShow] = useState();
    const [userHeaderSubmit,setUserHeaderSubmit] = useState();
    const history = useHistory();
    var fileHeaderOptions;
    useEffect(() => {
        setCondType("No");
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
            // const dataJSON = JSON.stringify(data, null, 2);
            setExcelJSON(data);
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
        e.preventDefault();
        const curr_state = {
            date: e.target.dateCol.value,
            price: e.target.priceCol.value,
            model: e.target.modelCol.value,
        }
        setUserHeader(curr_state);
        setUserHeaderSubmit(true);
        setModelShow(false);
        return(<div></div>);
    }
    function handleImageFileChange(e){
        const files = e.target.files;
        if (files && files[0]) {
            console.log(files[0]);
            setSchemeImage(files[0]);
        }
         
    }
    async function handleAddScheme(event) {

        const imgData = new FormData();
        imgData.append('file', schemeImage);
        try{
            axios.post('/upload/', imgData);
        }
        catch(e){
            console.log(e);
            alert(e.message);
        }


        var priceOperator;
        var condValue; 
        event.preventDefault();
        if(condType === "No"){
            priceOperator = null;
            condValue = null
        }
        else if(condType === "Price_Condition"){
            priceOperator = event.target.priceOperator.value;
            condValue = event.target.condValue.value
        }
        if(userHeaderSubmit){
            try{
                
            const createTask = await axios.post(`/scheme/`, {
                    name: event.target.schemeName.value,
                    start_date: event.target.startDate.value,
                    end_date: event.target.endDate.value,
                    condition_type: event.target.condType.value,
                    price_condition: {
                        operator: priceOperator,
                        price : condValue
                    },
                    data_header:{
                        date: userHeader.date,
                        price: userHeader.price,
                        model: userHeader.model
                    },
                    excel_data:excelJSON,
                    creditValue:{
                        creditType: event.target.creditType.value,
                        creditValue: event.target.creditValue.value
                    },
                    excel_file:{
                        name:file.name,
                        size:file.size
                    },
                    fileName:file
            });
            alert('Scheme ' + event.target.schemeName.value + ' added succesfully');
            history.push("/");
            }
            catch(e){
            console.log(e);
            alert(e.message);
            }
        }
        else{
            alert("Please upload the Activation Sheet & select the correct columns");
        }
       //  alert("States added successfully");
       //  fetchStateData();
   }
    return(
    <div className = "container">
        <div className="row">
            <div className="col-md-4 offset-md-4">

            {/* <h3>Now Understanding Credit Note is Easier, Just upload your activation sheet and scheme Details, credit Note (CN) will be calculated for you in less than a minute</h3> */}


            <p>Please select the Activation file first, then add the scheme details below</p>
            <Form onSubmit = {handleActivationUpload}> 
            <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Activation Sheet</Form.Label>
                    <Form.Control type="file" accept={SheetJSFT} onChange={handleActivationFileChange}/>
                    <Button variant="primary" type="submit">Upload</Button>
            </Form.Group>
            </Form>
        <Form onSubmit={handleAddScheme}>
            <Form.Group controlId="formFile" className="mb-3" >
                    <Form.Label>Upload Scheme Image (Optional)</Form.Label>
                    <Form.Control type="file" name="file" onChange={handleImageFileChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Scheme Name</Form.Label>
                <Form.Control required type="name" name="schemeName" placeholder="Enter Scheme Name" />
                <Form.Text className="text-muted">
                Create a new name for scheme to help you track later on
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="start_date">
                <Form.Label>Start Date</Form.Label>
                <Form.Control required type="date" name="startDate" placeholder="Scheme Start Date" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" name="endDate" placeholder="Scheme End Date" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCondType">
                <Form.Label>Select Condition Type</Form.Label>
                <Form.Control required
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
            <Form.Group className="mb-3" controlId="formBasicOperator">
            <Form.Label>Offered Amount</Form.Label>
                <Row>
                    <Col md={2} xs={4}>
                        <Form.Control
                        as="select" name="creditType">
                        <option value="%">%</option>
                        <option value="flat">Flat</option>
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Control type="number" step="0.01" name="creditValue" placeholder="Enter Value" />
                    </Col>
                </Row>  
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>

        <Modal show={modelShow}>
            <Modal.Header>
              <Modal.Title>Please Select the Correct Attributes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUserHeaderSubmit}>
                    <Form.Group className="mb-3" controlId="date_column">
                        <Form.Label>Date Column</Form.Label>
                        <Form.Control as="select" name="dateCol">
                        {fileHeaderOptions}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="model_column">
                        <Form.Label>Model Column</Form.Label>
                        <Form.Control as="select" name = "modelCol">
                        {fileHeaderOptions}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Price_column">
                        <Form.Label>Price Column</Form.Label>
                        <Form.Control as="select" name ="priceCol">
                        {fileHeaderOptions}
                        </Form.Control>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="primary" type="Submit">
                            Submit 
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
            
          </Modal>
        </div>
        </div>
    </div>)
}
export default NewSchemeForm;