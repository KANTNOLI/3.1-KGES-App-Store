import { Link } from "react-router";
import style from "./Store.module.scss"
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
interface preview {
    "img": string,
    "header": string,
    "price": number
}

interface apps {
    "refID": string,
    "preview": preview,
    "title": string,
    "desc": string,
    "img": string[]
}



function Store() {

    const [apps, setApps] = useState<apps[]>([])
    const MainPanel = useRef<HTMLDivElement>(null)
    const DragPanel = useRef<HTMLDivElement>(null)

    const HandleDragMove = useCallback(
        (event: MouseEvent) => {
            if (event.clientX > 78 && event.clientX < 800) {
                if (MainPanel.current && DragPanel.current) {
                    MainPanel.current.style.width = `${event.clientX}px`
                    DragPanel.current.style.left = `${event.clientX}px`
                }
            }
        },
        [],
    )
    const HandleDragActive = useCallback(
        () => {
            document.body.style.cursor = "e-resize"
            document.body.addEventListener("mousemove", HandleDragMove)
        },
        [HandleDragMove],
    )
    const HandleDragDisable = useCallback(
        () => {
            document.body.style.cursor = "default"
            document.body.removeEventListener("mousemove", HandleDragMove)
        },
        [HandleDragMove],
    )

    useEffect(() => {
        axios.get("http://localhost:2403/api/getAppList").then((res) => {
            const temp = res.data as apps[]
            setApps(temp)
        })
    }, [])

    useEffect(() => {
        DragPanel.current?.addEventListener("mousedown", HandleDragActive)
        document.body.addEventListener("mouseup", HandleDragDisable)
        return () => {
            DragPanel.current?.removeEventListener("mousedown", HandleDragActive)
            document.body.removeEventListener("mouseup", HandleDragDisable)
        }
    }, [apps])

    return (
        <>
            <section ref={MainPanel} className={style.body}>
                {apps.map((app) =>
                    <Link key={app.refID} to={`/${app.refID}`} className={style.page}>
                        <img className={style.preview} src={app.preview.img} alt="preview" />
                        <div className={style.previewDiv}>
                            <p className={style.previewTitle}>{app.preview.header}</p>
                            <p className={style.previewPrice}>Price: {app.preview.price || "FREE"}</p>
                        </div>
                    </Link>
                )}

            </section>
            <p ref={DragPanel} className={style.dragPanel}></p>
        </>
    );
}

export default Store;