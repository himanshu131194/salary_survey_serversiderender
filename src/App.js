import React, { Component } from 'react';
import axios from 'axios';
import skill from './images/skill_market_value.svg';
import salary from './images/Discuss_salary.svg';
import career from './images/Decide_your_Career.svg';
import computer from './images/salary_display.svg';
import computer_white from './images/salary_display_white.svg';
import background from './images/Back-image.jpg';
import './App.css';
import './search-filter.css';
import Config from './config';
import Header from './components/Header';
import Footer from './components/Footer';


var topStyle={
  width: "100%",
  backgroundSize: 'cover',
  backgroundImage: `url(${background})`
};

class App extends Component {

  constructor(props){
    super(props);
    this.state={ salRange:null, cities: null, designations: null }
    if(!this.state.cities){
        axios.get(`${Config.ROOT_URL}/site/reactsalarycalculator`)
             .then(result=>{
                   this.setState({ cities: result.data['cities'], designations: result.data['designations'] } );
                   let ele = document.getElementById('designation'),
                   designations = this.state.designations;
                   this.autocompleteInput(ele, designations)
              })
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.validateFieldsValue = this.validateFieldsValue.bind(this);
    var number = 3500000;
    console.log(number.toLocaleString());
  }

  autocompleteInput(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode === 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode === 13) {
          e.preventDefault();
          if (currentFocus > -1)
            if (x) x[currentFocus].click();
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x){
        for (var i = 0; i < x.length; i++)
        x[i].classList.remove("autocomplete-active");
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== inp){
           x[i].parentNode.removeChild(x[i]);
         }
        }
    }

    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });

  }

  defaultSalaryRangeBox(){
    return (
       <div className="defaultResultBox">
         <div className="result_title">Take next step of your career and elevate earning Potential</div>
         <div className="result_content">
           <img className="result_img" alt="graph" src={computer} />
           <p className="result_text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed  do eiusmod</p>
         </div>
       </div>
    )
  }

  resultSalaryRangeBox(){
    let range = this.state.salRange;
    return (
       <div className="newResultBox">
         <div className="newResult_content">
           <img className="newResult_img" alt="graph" src={computer_white} />
           <div className="right_content">
             <div className="newResult_title">Your Estimated Salary</div>
             <p className="newResult_text">{range}</p>
           </div>
         </div>
       </div>
    )
  }

  validateForm(element, flag){
     if(flag==0){
        element.style.border = "1px solid red";
        element.parentNode.getElementsByClassName('valid-error')[0].classList.remove('display-none');
        return false;
     }else{
       element.style.border = "1px solid #ced4da";
       element.parentNode.getElementsByClassName('valid-error')[0].classList.add('display-none');
     }
  }


  onFormSubmit(e){
    e.preventDefault();
    let loc = e.target.getElementsByClassName('location')[0];
    let desig = e.target.getElementsByClassName('designation')[0];
    let exp = e.target.getElementsByClassName('experience')[0];

    if(desig.value=='')
       return this.validateForm(desig, 0)
    else
       this.validateForm(desig, 1)

    if(loc.value=='')
       return this.validateForm(loc, 0)
    else
       this.validateForm(loc, 1)

    if(exp.value=='')
       return this.validateForm(exp, 0)
    else
       this.validateForm(exp, 1)

    const formData = new FormData();
          formData.append('city_name', loc.value);
          formData.append('designation_name', desig.value);
          formData.append('work_experience', exp.value);
    axios.post(`${Config.ROOT_URL}/site/reactsalarycalculator`, formData)
         .then(result=>{
             let range = result.data['data'] ?  "Rs "+result.data['data'].min_salary.toLocaleString()+" - Rs "+result.data['data'].max_salary.toLocaleString(): result.data['error'];
             this.setState({ salRange : range });
         })
  }

  getCities(){
     let cities = null;
     if(this.state.cities){
        cities = this.state.cities.map((res)=>{
             let ignoreArr = [49, 152, 30];
             if(ignoreArr.indexOf(res.id) == -1){
               return (
                <option key={res.id} value={res.city}>{res.city}</option>
               )
             }
         })
     }
     return cities;
  }

  getDesignation(){
    let desig = null;
    if(this.state.designations){
       desig = this.state.designations.map((res)=>{
             return (
               <option key={res.id} value={res.designation_name}>{res.designation_name}</option>
             )
        })
    }
    return desig;
  }

  validateFieldsValue(e){
      if(e.target.value=='')
         return this.validateForm(e.target, 0)
      else
         this.validateForm(e.target, 1)
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <div className="Salary-content">
          <div className="top_content" style={ topStyle } >
            <h2 className="App-title">How Much You Should be you Getting paid?</h2>
            <p className="first_text">How Much does a "designation" make in "City"</p>
            <p className="second_text">Try out our free salary calculator, Salary is based
            on the city living standard, company policy and based on the market research data.</p>
            <div className="App-intro">
              <form className="" onSubmit={this.onFormSubmit}>
                <div className="custom_form">
                <div className="form-group">
                    <div className="autocomplete">
                       <input className="form-control designation" name="designation" id="designation" placeholder="Designation" autoComplete="off" onKeyUp={this.validateFieldsValue}/>
                       <div className="valid-error display-none">Please enter designation</div>
                    </div>
                </div>
                <div className="form-group">
                    <select className="form-control location" name="location" onChange={this.validateFieldsValue}>
                      <option value="">Select Location</option>
                      {this.getCities()}
                    </select>
                    <div className="valid-error display-none">Please select location</div>
                </div>
                <div className="form-group">
                   <select name="experience" className="form-control experience" placeholder="Experience"  onChange={this.validateFieldsValue}>
                      <option value="" default>Experience in Years</option>
                      <option value="3">0-3 Years</option>
                      <option value="6">3-6 Years</option>
                      <option value="10">6-10 Years</option>
                      <option value="11">10+ Years</option>
                    </select>
                    <div className="valid-error display-none">Please select experience</div>
              </div>
              <div className="form-group">
                  <button className="submit form-control" name="submit">Estimate Salary</button>
              </div>
              </div>
            </form>
          </div>
        </div>
        <div className="result_box">{this.state.salRange? this.resultSalaryRangeBox(): this.defaultSalaryRangeBox()}</div>
        <div className="bottom_content">
          <div className="box_div">
            <div className="content_box">
              <div className="box_head">
                <div className="box_title">Your skill market value</div>
                <img src={skill} className="box_img" alt="first" />
              </div>
              <div className="box_text">
                Get the estimated salary based on experience and skills. Set the designation, location, and experience to get the expected salary range.
              </div>
            </div>
            <div className="content_box">
              <div className="box_head">
                <div className="box_title">Discuss salary based on data</div>
                <img src={salary} className="box_img" alt="devices" />
              </div>
              <div className="box_text">
                Your Salary range will help you to negotiate for the new job. Help you while salary review discussion.
              </div>
            </div>
            <div className="content_box">
              <div className="box_head">
                <div className="box_title">Decide your Career and company</div>
                <img src={career} className="box_img" alt="discussion" />
              </div>
              <div className="box_text">
                Make your career decision more effective and elevate your earning potential based on salary estimation
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    );
  }
}

export default App;
