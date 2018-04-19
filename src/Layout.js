import React, { Component, cloneElement } from 'react';
import PropTypes from "prop-types";

import Pane from "./Pane";
import SplitPane from "./SplitPane";

export default class TileLayout extends Component {
  static propTypes = {
    renderTile: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.object
  };

  onChange = (path, size) => {
    const {value, onChange} = this.props;
    const newValue = Object.assign({}, value);

    let idx = 0;
    let node = newValue;
    while(idx < path.length) {
      node = node.panes[path[idx]];
      idx++;
    }

    // update sizes
    const newPanes = node.panes.map((pane, idx) => {
      return Object.assign({}, pane, {
        size: size[idx]
      })
    });
    node.panes = newPanes;

    onChange && onChange(newValue);
  }

  onResizeStart = (path, index) => {
    this.props.onResizeStart && this.props.onResizeStart(index, path);
  }

  renderRecursively(node, path) {
    if (node.panes) {
      const split = node.direction === "column" ? "vertical" : "horizontal";
      const panes = node.panes.map((config, idx) => {
        const { size, maxSize, minSize } = config;

        const p = path.concat(idx);

        return <Pane key={p} initialSize={size} maxSize={maxSize} minSize={minSize}>
            {this.renderRecursively(config, p)}
          </Pane>;
      });

      return (
        <SplitPane
          split={split}
          onChange={this.onChange.bind(null, path)}
          onResizeStart={this.onResizeStart.bind(null, path)}
          onResizeEnd={this.props.onResizeEnd}
        >
          {panes}
        </SplitPane>
      );
    }

    return this.props.renderTile(node.id, path);
  }

  render() {
    return this.renderRecursively(this.props.value, []);
  }
}