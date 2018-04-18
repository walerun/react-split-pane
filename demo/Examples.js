import React, {Component} from 'react';
import {render} from 'react-dom';
import SplitPane from '../lib/SplitPane';
import Pane from "../lib/Pane";
import Layout from "../lib/Layout";

const config = {
  "direction": "row",
  "panes": [
      {
          "direction": "column",
          "size": "250px",
          "panes": [
              {
                  "size": "25%",
                  "minSize": "200px",
                  "id": "filtered-dimensions-top"
              },
              {
                  "id": "filtered-dimensions-bottom"
              }
          ]
      },
      {
          "id": "edit-form-sheet"
      }
  ]
};

const config2 = {
  "direction": "column",
  "panes": [
      {
          "size": "250px",
          "id": "filtered-dimensions-top"
      },
      {
          "id": "filtered-dimensions-bottom"
      }
  ]
};

const config3 = {
  direction: "column",
  panes: [
    {
      size: "80px",
      direction: "row",
      panes: [
        {
          size: "40px"
        },
        {
          id: "leftactions"
        }
      ]
    },
    {
      direction: "row",
      panes: [
        {
          id: "topactions",
          size: 2
        },
        {
          id: "product-analysis-subclass-top",
          size: "10%"
        },
        {
          id: "product-analysis-subclass-bottom"
        },
        {
          id: "product-analysis-subclass-bottom 2"
        }
      ]
    }
  ]
};

class ControlledExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: config
    };
  }

  onChange = (value) => {
    this.setState({value});
  };

  render() {
    return (
      <section>
  
        <pre className="source">
          {`
          <Layout value={}/>
          `}
        </pre>
  
        <div className="example">
  
          <Layout value={this.state.value} onChange={this.onChange} renderTile={id => `Tile ${id}`}/>
  
        </div>
  
      </section>
    );
  }
}

class SimpleExample extends Component {
  constructor(props) {
    super(props);

    const str = localStorage.getItem("paneSizes");
    const sizes = JSON.parse(str);

    this.state = {
      sizes
    };
  }

  handleChangeSize(size) {
    console.log(size);
    localStorage.setItem("paneSizes", JSON.stringify(size));
  }

  render() {
    const sizes = this.state.sizes;

    return (
      <section>
  
        <pre className="source">
          {`
          <SplitPane split="vertical">
            <Pane>You can use a Pane component</Pane>
            <div>or you can use a plain old div</div>
            <Pane initialSize="25%" minSize="10%" maxSize="500px">Using a Pane allows you to specify any constraints
              directly</Pane>
          </SplitPane>
          `}
        </pre>
  
        <div className="example">
  
          <SplitPane split="vertical" onChangeSize={this.handleChangeSize}>
            <Pane initialSize={sizes[0]} maxSize="200px"><div>You can use a Pane component1</div><div>test</div></Pane>
            <div>or you can use a plain old div</div>
            <Pane initialSize="15%" minSize="10%" maxSize="500px">Using a Pane allows you to specify any constraints
              directly</Pane>
          </SplitPane>
  
        </div>
  
      </section>
    );
  }
}


const SimpleNestedExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="vertical">
            <Pane/>
            <Pane/>
            <SplitPane split="horizontal">
              <Pane/>
              <Pane/>
              <Pane/>
            </SplitPane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="vertical">
          <Pane/>
          <Pane/>
          <SplitPane split="horizontal">
            <Pane/>
            <Pane/>
            <Pane/>
          </SplitPane>
          <Pane/>
        </SplitPane>

      </div>

    </section>
  );
};



const MultiplePropsNestedExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <Pane initialSize="200px" minSize="200px" maxSize="600px">initialSize="200px" minSize="200px" maxSize="600px"</Pane>
          <Pane minSize="20%" maxSize="80%">minSize="20%" maxSize="80%"</Pane>
          <SplitPane split="horizontal">
            <Pane minSize="10%" maxSize="600px">minSize="10%" maxSize="600px"</Pane>
            <Pane initialSize="50%" minSize="50px" maxSize="80%">initialSize="50%" minSize="50px" maxSize="80%"</Pane>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="vertical">
          <Pane initialSize="200px" minSize="200px" maxSize="600px">initialSize="100px" minSize="100px" maxSize="600px"</Pane>
          <Pane minSize="20%" maxSize="80%">minSize="20%" maxSize="80%"</Pane>
          <SplitPane split="horizontal">
            <Pane minSize="10%" maxSize="600px">minSize="10%" maxSize="600px"</Pane>
            <Pane initialSize="50%" minSize="50px" maxSize="80%">initialSize="50%" minSize="50px" maxSize="80%"</Pane>
          </SplitPane>
        </SplitPane>

      </div>

    </section>
  );
};


const BasicVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
        <SplitPane split="vertical">
          <div>This is a div</div>
          <div>This is a div</div>
        </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="vertical">
          <div>This is a div</div>
          <div>This is a div</div>
        </SplitPane>

      </div>

    </section>
  );
};

const BasicHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <div>This is a div</div>
            <div>This is a div</div>
          </SplitPane>        
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <div>This is a div</div>
          <div>This is a div</div>
        </SplitPane>
        
      </div>
    </section>
  );
};

const BasicVerticalPaneExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="vertical">
            <Pane>This is a Pane</Pane>
            <Pane>This is a Pane</Pane>
          </SplitPane>        
        `}
      </pre>

      <div className="example">

        <SplitPane split="vertical">
          <Pane>This is a Pane</Pane>
          <Pane>This is a Pane</Pane>
        </SplitPane>
        
      </div>
    </section>
  );
};

const BasicHorizontalPaneExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane>This is a Pane</Pane>
            <Pane>This is a Pane</Pane>
          </SplitPane>        
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane>This is a Pane</Pane>
          <Pane>This is a Pane</Pane>
        </SplitPane>

      </div>
    </section>
  );
};

const PanesAndDivsExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane>This is a Pane</Pane>
            <Pane>This is a Pane</Pane>
          </SplitPane>        
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane>This is a Pane</Pane>
          <div>This is a div</div>
        </SplitPane>

      </div>
    </section>
  );
};

const InitialPercentageVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane>
          <Pane initialSize="20%">This Pane has initial size of 20%</Pane>
          <Pane/>
        </SplitPane>        
        `}
      </pre>

      <div className="example">

        <SplitPane>
          <Pane initialSize="20%">This Pane has initial size of 20%</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};

const InitialPercentageHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane/>
            <Pane initialSize="20%">This Pane has initial size of 20%</Pane>
          </SplitPane>      
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane/>
          <Pane initialSize="20%">This Pane has initial size of 20%</Pane>
        </SplitPane>

      </div>
    </section>
  );
};


const InitialPxVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane>
            <Pane initialSize="200px">This Pane has initial size of 200px</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane>
          <Pane initialSize="200px">This Pane has initial size of 200px</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>  
  );
};

const InitialPxHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane/>
            <Pane initialSize="200px">This Pane has initial size of 200px</Pane>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane/>
          <Pane initialSize="200px">This Pane has initial size of 200px</Pane>
        </SplitPane>

      </div>
    </section>  );
};


const MinPercentageVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane>
            <Pane minSize="20%">This Pane has a minimum size of 20%</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane>
          <Pane minSize="20%">This Pane has a minimum size of 20%</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};

const MinPercentageHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane minSize="20%">This Pane has a minimum size of 20%</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane minSize="20%">This Pane has a minimum size of 20%</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};


const MinPxVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane>
            <Pane minSize="200px">This Pane has a minimum size of 200px</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane>
          <Pane minSize="200px">This Pane has a minimum size of 200px</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>  
  );
};

const MinPxHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane minSize="200px">This Pane has a minimum size of 200px</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane minSize="200px">This Pane has a minimum size of 200px</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};


const MaxPercentageVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane>
            <Pane maxSize="20%">This Pane has a maximum size of 20%</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane>
          <Pane maxSize="20%">This Pane has a maximum size of 20%</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};

const MaxPercentageHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane maxSize="20%">This Pane has a maximum size of 20%</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane maxSize="20%">This Pane has a maximum size of 20%</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};


const MaxPxVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane>
            <Pane maxSize="200px">This Pane has a maximum size of 200px</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane>
          <Pane maxSize="200px">This Pane has a maximum size of 200px</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};

const MaxPxHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <Pane maxSize="200px">This Pane has a maximum size of 200px</Pane>
            <Pane/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <Pane maxSize="200px">This Pane has a maximum size of 200px</Pane>
          <Pane/>
        </SplitPane>

      </div>
    </section>
  );
};


const MultipleVerticalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="vertical">
            <div/>
            <div/>
            <div/>
            <div/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="vertical">
          <div/>
          <div/>
          <div/>
          <div/>
        </SplitPane>

      </div>
    </section>
  );
};

const MultipleHorizontalExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <SplitPane split="horizontal">
            <div/>
            <div/>
            <div/>
            <div/>
          </SplitPane>
        `}
      </pre>

      <div className="example">

        <SplitPane split="horizontal">
          <div/>
          <div/>
          <div/>
          <div/>
        </SplitPane>

      </div>
    </section>
  );
};

const SubComponentExample = () => {
  return (
    <section>

      <pre className="source">
        {`
          <div className="parent">
            <div className="header">Header</div>
            <div className="wrapper">
              <SplitPane split="horizontal">
                <div/>
                <div/>
              </SplitPane>
            </div>
          </div>
        `}
      </pre>

      <div className="example">

        <div className="parent">
          <div className="header">Header</div>
          <div className="wrapper">
            <SplitPane split="horizontal">
              <div/>
              <div/>
            </SplitPane>
          </div>
        </div>

      </div>
    </section>
  );
};


const examples = {
  ControlledExample,
  SimpleExample,
  SimpleNestedExample,
  MultiplePropsNestedExample,
  SubComponentExample,
  MultipleHorizontalExample,
  MultipleVerticalExample,
  MaxPxHorizontalExample,
  MaxPxVerticalExample,
  MaxPercentageHorizontalExample,
  MaxPercentageVerticalExample,
  MinPxHorizontalExample,
  MinPxVerticalExample,
  MinPercentageHorizontalExample,
  MinPercentageVerticalExample,
  InitialPxHorizontalExample,
  InitialPxVerticalExample,
  InitialPercentageHorizontalExample,
  InitialPercentageVerticalExample,
  BasicHorizontalPaneExample,
  BasicVerticalPaneExample,
  BasicHorizontalExample,
  BasicVerticalExample,
  PanesAndDivsExample,
};


const name = document.location.search.substr(1);
const Comp = examples[name];
if (Comp) {
  render(<Comp/>, document.getElementById('root'));
}


