import {useLocation, useNavigate} from "react-router-dom"
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {Alert} from "react-bootstrap";
import {setField, setPage} from "../state/formSlice";

/**
 * ResultPage is a page that checks if the queries are valid and sets the fields in the store
 * then redirects to the ResultPage
 */
export function ResultParser() {
    const location = useLocation()
    const navigate = useNavigate()
    const queries = new URLSearchParams(location.search)

    const formFields = useAppSelector((state) => state.form.fields)
    const dispatch = useAppDispatch()
    const errors: string[] = []

    // Check if the queries are valid
    Array.from(queries.entries()).forEach(([key, value]) => {
      if (isNaN(parseInt(value))) {
          errors.push(`Verdien "${value}" for feltnavnet "${key}" er ikke et heltall`)
      } else if (formFields[key] === undefined) {
          errors.push(`Feltnavnet "${key}" er ikke gyldig`)
          console.log("Feltnavnet er ikke gyldig")
      } else {
          dispatch(setField({title: key, value: value}))
      }
    })
    dispatch(setPage(3))


    return (
        <>
            {errors.length > 0 ? errors.map((error) => <Alert>{error}</Alert>) : navigate("/")}
        </>
    )
}