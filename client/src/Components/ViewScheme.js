import {
    Card, Button, Col, Row, Toast
  } from 'react-bootstrap';
import {useState,useEffect} from 'react';
import {FaChevronCircleDown,FaChevronCircleUp,FaEdit} from 'react-icons/fa';
import {MdDelete,MdAddCircle,MdCancel} from 'react-icons/md';
import Loading from './Loading';
import axios from "axios";

  
function datePretty(date1){
    return Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(date1)));
}
function toggleView(id){
    const schemeDoc = document.getElementById(id);
    const schemeMore = schemeDoc.getElementsByClassName("more-details")[0];
    const schemeViewDown = schemeDoc.getElementsByClassName("down-icon")[0];
    const schemeViewUp = schemeDoc.getElementsByClassName("up-icon")[0];

    if(schemeMore.style.display==="none" || schemeMore.style.display==="" ){
        schemeMore.style.display="block";
        schemeViewDown.style.display = "none";
        schemeViewUp.style.display = "block";
    }
    else {
        schemeMore.style.display="none";
        schemeViewDown.style.display = "block";
        schemeViewUp.style.display = "none";
    };
    // console.log(document.getElementById(id).style.display);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function ViewScheme(){
    const [schemeData,updateSchemeData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [deleteLoading,setDeleteLoading] = useState(false);
    const [deleteshow, setDeleteShow] = useState(false);
    var schemeDetails;
    function DeleteToast() {
        
      
        return (    
        <div class="fixed-bottom">
          <Row>
            <Col xs={12}>
              <Toast onClose={() => setDeleteShow(false)} show={deleteshow} delay={2000} autohide>
                <Toast.Body>Scheme Deleted Succefully</Toast.Body>
              </Toast>
            </Col>
          </Row>
        </div>
        );
    }
    async function fetchSchemeData(){
        try{
            
            const schemeData = await axios.get(`/scheme/`).then(setLoading(false));
            const dataFromAPI = schemeData.data.results;
            updateSchemeData(dataFromAPI);
        }
        catch (e) {
            console.log(e);
            alert("Cannot Fetch your schemes. ERROR : " + e.message);
        }
    }
    useEffect(() => {
          fetchSchemeData();
      }, []);
    async function deleteScheme(id){
        setDeleteLoading(true);

        // await sleep(2000);        
        try{
            const delete_scheme = await axios.delete(`/scheme/${id}`).then(setDeleteLoading(false)).then(setDeleteShow(true));
            updateSchemeData(schemeData.filter(item => item._id !== id));
            
        }
        catch (e) {
            console.log(e);
            alert(e.message);
        }
    }

      if(schemeData){
        schemeDetails = schemeData.map((scheme)=> {
            var x = parseInt(scheme.creditNote);
            x=x.toString();
            var lastThree = x.substring(x.length-3);
            var otherNumbers = x.substring(0,x.length-3);
            var editLink = "/updatescheme/"+ scheme._id
            if(otherNumbers != '')
                lastThree = ',' + lastThree;
            var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            return (
                    <Card style={{ width: '100%' }} id={scheme._id} className="mt-4" key={scheme._id}>
                        {/* <Card.Img variant="top" src="assets/images/special_offer.jpg" /> */}
                        <Card.Body>
                            <div className="row">
                                <div className="col-md-6">
                                    <Card.Title>{scheme.name}</Card.Title>
                                </div>
                                <div className="col-md-6">
                                    <Card.Text>{datePretty(scheme.start_date)} to {datePretty(scheme.end_date)}</Card.Text>
                                </div>
                            </div>
                            {/* </Col> */}
                            <Button className="green-background">Credit Note : ₹ {res}</Button>
                                <Button className = "view-more" onClick={() => toggleView(scheme._id)}><FaChevronCircleDown size={30} className="down-icon"/><FaChevronCircleUp size={30} className="up-icon"/></Button>
                                <Button className="button-edit" onClick={(e) => {e.preventDefault();window.location.href=editLink;}}><FaEdit size={30} /></Button>
                            <Button className="button-delete" onClick={(e) => {if (window.confirm('Are you sure you wish to delete this scheme?')) deleteScheme(scheme._id)}}><MdCancel size={30}/></Button>
                            <div className = "more-details">
                                <span>{scheme.creditValue.creditValue}</span><span>{scheme.creditValue.creditType}</span>
                            </div>
                            
                        </Card.Body>
                    </Card>
            )
        });
        }
    return (
        <div className = "container">
            {loading || deleteLoading ? <Loading /> : 
            <div className="row">
                <div className="col-md-4 offset-md-4 p-0">
                  
                    {/* <a href="/newscheme">Add Scheme</a> */}
                    {schemeDetails}
                </div>
                {deleteshow ? <DeleteToast /> : ""}
            </div>
            }
        </div>
      );
}
export default ViewScheme;