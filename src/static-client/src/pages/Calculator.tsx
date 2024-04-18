import {ResultContent} from "../containers/ResultContent";
import Sheet from "react-modal-sheet";
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {ResultParameters} from "../components/result/ResultParameters";
import {ResultPeek} from "../components/result/ResultPeek";

export function Calculator() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    const updateMedia = () => {
        setIsDesktop(window.innerWidth >= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    })



    return (
        <>
            {isDesktop ? (
                <DesktopView />
            ) : (
                <MobileView />
            )}
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