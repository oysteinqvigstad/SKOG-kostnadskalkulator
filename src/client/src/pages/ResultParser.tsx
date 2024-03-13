import {useLocation, useNavigate} from "react-router-dom"
import {useAppDispatch} from "../state/hooks";
import {Alert} from "react-bootstrap";
import {testTree, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {setInputsByURLQueries} from "@skogkalk/common/dist/src/parseTree/treeState";
import {initiateTree} from "../state/treeSlice";

/**
 * ResultPage is a page that checks if the queries are valid and sets the fields in the store
 * then redirects to the ResultPage
 */
export function ResultParser() {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const queries = Array.from(new URLSearchParams(location.search).entries())

    try {
        const tree = setInputsByURLQueries(treeStateFromData(testTree), queries, ',')
        if (tree) {
            dispatch(initiateTree({tree}))
        }
        navigate("/kalkulator")
    } catch (e) {
        if (e instanceof Error) {
            return <Alert>{e.message}</Alert>
        }
    }



    return (
        <>
        </>
    )
}