import {ResultContent} from "../containers/ResultContent";
import Sheet from "react-modal-sheet";
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {ResultParameters} from "../components/result/ResultParameters";
import {ResultPeek} from "../components/result/ResultPeek";
import {useParams} from "react-router-dom";
import {useGetCalculatorTreeQuery} from "../state/store";
import {initiateTree} from "../state/treeSlice";
import {treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {useAppDispatch} from "../state/hooks";

export function LandingPage() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    const updateMedia = () => {
        setIsDesktop(window.innerWidth >= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    })

    const dispatch = useAppDispatch()
    const {name, version} = useParams()
    const validParams = name && version && !isNaN(parseInt(version))

    const {data, error, isLoading} = useGetCalculatorTreeQuery({name: name!, version: parseInt(version!)}, {skip: !validParams})

    useEffect(() => {
        if (data) {
            dispatch(initiateTree({tree: treeStateFromData(data)}))
        }
    }, [data, dispatch]);



    return (
        <>
            {data && isDesktop && <DesktopView />}
            {data && !isDesktop && <MobileView />}
            {isLoading && <p>{"Laster inn kalkulator"}</p>}
            {error && <p>{"En feil oppstod ved henting av kalkulator"}</p>}
            {!validParams && <p>{"Ugyldig nettaddresse, sjekk navn på kalkulator og versjon"}</p>}

        </>
    )
}

function MobileView() {
    const [isOpen, setIsOpen] = useState(false)

    const onTapClose = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)
    }

        return (
        <>
            <ResultParameters />
            <div style={{height: '100px'}} />
            <Button
                className={"fixed-bottom"}
                onClick={() => setIsOpen(true)}
            >
                <ResultPeek />
            </Button>
            <Sheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header
                        onTap={onTapClose}
                    />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <ResultContent />
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    )
}

function DesktopView() {
    return (
        <ResultContent />
    )
}