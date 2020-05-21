import axios from "axios";
import React, {useState, useEffect} from "react";
import * as yup from "yup";
// Yup is a JavaScript schema builder for value parsing and validation.
//  Define a schema, transform a value to match, validate the shape of an existing value, or both.


    // string.required(message?: string | function): Schema
    // The same as the mixed() schema required, except 
    //that empty strings are also considered 'missing' values.
const formSchema = yup.object().shape({
    name: yup.string().required("I'll kow if you're lying"),
    email: yup.string().email().required("Enter a valid email"),
    password: yup.string().required("I know your password anyway"),  
    tradeOne: yup.string().required("This is required"),
    tradeTwo: yup.string().required("Pick Something"),
    tradeThree: yup.string().required("Be very very sure"),
    checkbox: yup.boolean().oneOf([true], "check properly"),
    });

// set state to the values below for later use
export default function Form() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        checkbox: "",
        tradeOne:"",
        tradeTwo: "",
        tradeThree: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        checkbox: "",
        checkbox: "",
        tradeOne:"",
        tradeTwo: "",
        tradeThree: "",
    })
// setting state for submit button,  You wont be able to hit the submit button unless anything is inputted
// in the text areas.  
    const [submitDisable, setSubmitDisabled] = useState(true);

    const [post, setPost] = useState([]);
    useEffect(() => {
    formSchema.isValid(formState).then(valid => {
        setSubmitDisabled(!valid);
        });
        }, [formState]);
    
//
    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then(() => {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
            })
            .catch(err => {
            setErrors({
                ...errors,
                [e.target.name]: err.errors
            });
            });
        };
        //  prevents page from auto refreshing, Also created a post request to 
        // request data from the API
        const formSubmit = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then(res => {
            setPost(res.data);
            console.log("success", post);

            setFormState({
                name: "",
                email: "",
                password: "",
                checkbox: "",
                tradeOne: "",
                tradeTwo: "",
                tradeThree: "",
            });
            })
            .catch(err => {
            console.log(err.res);
            });
        };

    const inputChange = (event) => {
        event.persist();
        const newFormData = {
            ...formState,
            [event.target.name]:
                event.target.type === "checkbox" ? event.target.checked : event.target.value
            };
            validateChange(event);
            setFormState(newFormData);
    }
//  The text areas, I set it so if the length of what you're trying to submit is no greater than 0 characters
// then each one will promt you with an error message.
    return(
    <div>
        <h2>Sign Away your Soul</h2>
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name
                <input 
                id="name"
                type="text"
                name="name"
                value={formState.name}
                onChange={inputChange}
                />
                {errors.name.length > 0 ? (<p className="error">{errors.name}</p> ): null}
            </label>
            <br/>
            <label htmlFor="email">
                Email
                <input 
                id="email"
                type="text"
                name="email"
                value={formState.email}
                onChange={inputChange}
                />
                {errors.email.length > 0 ? (<p className="error"> {errors.email}</p>) : null}
            </label>
            <br/>
            <label htmlFor="password">
                Password
                <input 
                id="password"
                type="password"
                name="password"
                value={formState.password}
                onChange={inputChange}
                />
                {errors.name.length > 0 ? (<p className="error">{errors.password}</p> ): null}
            </label>
            <br/>        
            
            <label htmlFor="tradeOne">
            First Thing You Want.
                <input 
                id="trade1"
                type="text"
                name="tradeOne"
                value={formState.tradeOne}
                onChange={inputChange} 
                />
                {errors.name.length > 0 ? (<p className="error">{errors.tradeOne}</p> ): null}
            </label>
            <br/>
            <label htmlFor="tradeTwo">
            Alternative Option
                <input 
                id="trade2"
                type="text"
                name="tradeTwo"
                value={formState.tradeTwo}
                onChange={inputChange} 
                />
                {errors.name.length > 0 ? (<p className="error">{errors.tradeTwo}</p> ): null}
            </label>
            <br/>
            <label htmlFor="tradeThree">
            Are you Sure About This?
                <input 
                id="trade3"
                type="text"
                name="tradeThree"
                value={formState.tradeThree}
                onChange={inputChange} 
                />
                {errors.name.length > 0 ? (<p className="error">{errors.tradeThree}</p> ): null}
            </label>
            <br/>
            <div className="boxcheck"><label htmlFor="check">
            Are You Really Really Sure About This?
            <input 
            id="checkbox"
            type="checkbox"
            checked={formState.checkbox}
            name="checkbox"
            onChange={inputChange}
            />
            {errors.checked === false ? (<p className="error">{errors.checkbox}</p> ): null}
        </label></div>
            
            <br/>
            
            <button disabled={submitDisable}>Submit</button>
        </form>
    </div> 
    )
}
