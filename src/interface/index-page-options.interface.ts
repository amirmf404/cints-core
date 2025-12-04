import { ExportMode } from "../enum/export-mode.enum";
import { ExportType } from "../enum/export-type.enum";
import { IndexPageMode } from "../enum/index-page-mode.enum";
import { LoadMoreMode } from "../enum/load-more-mode.enum";

export interface IndexPageOptions {
  mode?: IndexPageMode;
  loadMoreMode?: LoadMoreMode;

  enableToggleMode?: boolean;
  showIndex?: boolean;
  limitOptions?: {
    enabled?: boolean; //! true
    default?: number; //! 10
  };
  exportOptions?: {
    enabled?: boolean;
    mode?: ExportMode;
    type?: ExportType[];
  };
  defaultSortBy?: string[];
}
