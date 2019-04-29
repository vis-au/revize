import { UrlData } from 'vega-lite/build/src/data';
import { DatasetNode } from './Datasets/DatasetNode';
import { URLDatasetNode } from './Datasets/URLDatasetNode';
import { GraphNode } from './GraphNode';
export declare class DataImporter {
    onNewDataset: (d?: DatasetNode) => void;
    private datasets;
    constructor();
    private getFileNameFromURL;
    readFileFromDisk(e: any): void;
    private convertCSVToDatasetNode;
    private fetchCSV;
    private fetchJSON;
    importPreset(preset: UrlData, node?: URLDatasetNode): void;
    loadFieldsAndValuesToNode(node: GraphNode): void;
}
