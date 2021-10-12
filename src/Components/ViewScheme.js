import {
    Card, Button, Col
  } from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from "axios";
function datePretty(date1){
    return Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(date1)));
}
function toggleView(id){
    const schemeDoc = document.getElementById(id);
    const schemeMore = schemeDoc.getElementsByClassName("more-details")[0];
    const schemeViewMore = schemeDoc.getElementsByClassName("view-more")[0];
    if(schemeMore.style.display==="none" || schemeMore.style.display==="" ){
        schemeMore.style.display="block";
        schemeViewMore.innerHTML = "Show less";
    }
    else {
        schemeMore.style.display="none";
        schemeViewMore.innerHTML = "Show More";
    };
    // console.log(document.getElementById(id).style.display);
}
async function deleteScheme(id){
    try{
        const delete_scheme = await axios.delete(`http://localhost:3000/scheme/${id}`);
        alert("Deleted scheme Succesfully");
        
    }
    catch (e) {
        console.log(e);
        alert(e.message);
    }
}
function ViewScheme(){
    const [schemeData,updateSchemeData] = useState([]);
    var schemeDetails;
    async function fetchSchemeData(){
        try{
            
            const schemeData = await axios.get(`http://localhost:3000/scheme/`);
            const dataFromAPI = schemeData.data.results;
            updateSchemeData(dataFromAPI);
        }
        catch (e) {
            console.log(e);
            alert(e.message);
        }
    }
    useEffect(() => {
        fetchSchemeData();
      }, []);

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
                    <Card style={{ width: '100%' }} id={scheme._id}>
                        <Card.Img variant="top" src="assets/images/special_offer.jpg" />
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
                            <Button className = "view-more" onClick={() => toggleView(scheme._id)}>Show More</Button>
                            <Button className="green-background"><a href={editLink}>Edit Scheme</a></Button>
                            <Button danger onClick={() => deleteScheme(scheme._id)}>Delete Scheme</Button>

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
            <div className="row">
                <div className="col-md-4 offset-md-4 p-0">
                    <a href="/newscheme">Add Scheme</a>
                    {schemeDetails}
                    
                </div>
            </div>
        </div>
      );
}
export default ViewScheme;