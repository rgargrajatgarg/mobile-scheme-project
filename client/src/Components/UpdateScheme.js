import {Form,Button,Row,Col,Modal} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import { model } from '../shared/model_data';
import { SheetJSFT } from '../shared/file_types';
import { make_cols } from './MakeColumns';
import axios from "axios";
import XLSX from 'xlsx';
import {useHistory} from "react-router-dom";
// var Multiselect = require('react-bootstrap-multiselect');


function RenderPriceCondition(props){
    return (
        <Form.Group className="mb-3" controlId="formBasicOperator">
            <Form.Label>Select the Condition</Form.Label>
            <Row>
                <Col md={2} xs={4}>
                    <Form.Control
                    defaultValue = {props.condition.operator}
                    as="select" name="priceOperator">
                    <option value=">=">{">="}</option>
                    <option value="=">=</option>
                    <option value="<=">{"<="}</option>
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control defaultValue={props.condition.price} type="number" name="condValue" placeholder="Enter Condition Value" />
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
        return <RenderPriceCondition condition={props.condition} />
    }
    else if(props.condType==="Model_Condition"){
        return <RenderModelCondition />
    }
    else {return(<div></div>);}
}
function UpdateScheme(props){
    const id = props.match.params.id;
    const [condType,setCondType] = useState();
    const [scheme,setScheme] = useState();
    const [Condition,setCondition] = useState([]);
    const history = useHistory();
    useEffect(() => {
        fetchSchemeData(id);
      }, []);
    async function fetchSchemeData(id){
        console.log(id);
        try{
                
            const schemeGetCall = await axios.get(`/scheme/${id}`);
            const dataFromAPI = schemeGetCall.data.results;
            setScheme(dataFromAPI);
            setCondType(dataFromAPI.condition_type);
            if(dataFromAPI.condition_type === "Price_Condition"){
                setCondition(dataFromAPI.price_condition);
            }
            // setFileHeader(dataFromAPI.data_header);
        }
        catch(e){
            console.log(e);
            alert(e.message);
        }
    }
    async function handleUpdateScheme(event) {
        var priceOperator;
        var condValue; 
        event.preventDefault();
        if(condType === "No"){
            priceOperator = null;
            condValue = null;
        }
        else if(condType === "Price_Condition"){
            priceOperator = event.target.priceOperator.value;
            condValue = event.target.condValue.value;
        }
            try{
                
            const createTask = await axios.put(`/scheme/${id}`, {
                    name: event.target.schemeName.value,
                    start_date: event.target.startDate.value,
                    end_date: event.target.endDate.value,
                    condition_type: event.target.condType.value,
                    price_condition: {
                        operator: priceOperator,
                        price : condValue
                    },
                    creditValue:{
                        creditType: event.target.creditType.value,
                        creditValue: event.target.creditValue.value
                    }
            });
                alert('Scheme ' + event.target.schemeName.value + ' updated succesfully');
                history.push("/");
            }
            catch(e){
            console.log(e);
            alert(e.message);
            }
       //  alert("States added successfully");
       //  fetchStateData();
   }
    if(scheme){
    return(
    <div className = "container">
        <div className="row">
            <div className="col-md-4 offset-md-4">

            {/* <h3>Now Understanding Credit Note is Easier, Just upload your activation sheet and scheme Details, credit Note (CN) will be calculated for you in less than a minute</h3> */}


            
        <Form onSubmit={handleUpdateScheme}>
            {/* Scheme Name */}
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Scheme Name</Form.Label>
                <Form.Control required type="name" name="schemeName" placeholder="Enter Scheme Name" defaultValue={scheme.name} />
                <Form.Text className="text-muted">
                Create a new name for scheme to help you track later on
                </Form.Text>
            </Form.Group>
            {/* Start & End Date */}
            <Form.Group className="mb-3" controlId="start_date">
                <Form.Label>Start Date</Form.Label>
                <Form.Control required type="date" name="startDate" placeholder="Scheme Start Date" defaultValue={scheme.start_date.split("T")[0]} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" name="endDate" placeholder="Scheme End Date" defaultValue={scheme.end_date.split("T")[0]}/>
            </Form.Group>

            {/* Condition Type & Render Condition */}
            <Form.Group className="mb-3" controlId="formBasicCondType">
                <Form.Label>Select Condition Type {scheme.condition_type}</Form.Label>
                <Form.Control required
                defaultValue={scheme.condition_type}
                as="select"
                name="condType"
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
            <RenderCondition condType={condType} condition={Condition} />
            {/* Offer Type & Amount */}
            <Form.Group className="mb-3" controlId="formBasicOperator">
                <Form.Label>Offered Amount</Form.Label>
                <Row>
                    <Col md={2} xs={4}>
                        <Form.Control
                        defaultValue = {scheme.creditValue.creditType}
                        as="select" name="creditType">
                        <option value="%">%</option>
                        <option value="flat">Flat</option>
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Control type="number" step="0.01" name="creditValue" placeholder="Enter Value" defaultValue = {scheme.creditValue.creditValue}/>
                    </Col>
                </Row>  
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        </div>
        </div>
    </div>)
    }
    else{
        return (<div>Loading Scheme...</div>);
    }
}
export default UpdateScheme;