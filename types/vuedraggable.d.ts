interface VueDraggableChangeEvent {
    moved: {
        element?: any,
        newIndex: number,
        oldIndex: number,
    }
}

interface SortableEvent {
    newIndex: number
    oldIndex: number
    item: any
}
