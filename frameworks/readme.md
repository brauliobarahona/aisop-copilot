Many frameworks, tools, approaches, and full-fledged software solutions to create agents and agents systems exist. For the proof of concept we created we used Langchain. Below is a list of some popular and widely used ones, some of them which we also explored. 

## Frameworks

- [ ] [Langchain](https://python.langchain.com/docs/introduction/). LangChain is a framework for developing applications powered by language models. It provides tools and abstractions to simplify the process of building applications that leverage large language models (LLMs) for various tasks, including chatbots and data analysis.

- [ ] [Dialogflow](https://cloud.google.com/dialogflow/docs). Dialogflow is a natural language understanding platform that integrates into mobile apps, web applications, devices, and bots.

- [ ] [Botpress](https://botpress.com/docs). The SDK establishes standardized contracts for integrations, such as human-in-the-loop (hitl) interface to support human agent intervention.

- [ ] [IBM Watson Assistant](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-getting-started). Focuses on chatbots for customer support with *actions* that represent a discrete outcome that you want your assistant to be able to accomplish in response to a user's request.

- [ ] [Amazon Lex V2](https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html). AWS service for building conversational interfaces for applications.

- [ ] [Rivet](https://github.com/Ironclad/rivet). IDE to create complex AI agents, including prompt chaining. https://rivet.ironcladapp.com

- [ ] [Wit.ai](https://wit.ai/docs). Natural language processing platform to build conversational interfaces to IoT. [python SDK](https://github.com/wit-ai/pywit). Owned by [Meta](https://developers.facebook.com/videos/2019/meet-witai-the-free-nlp-service/), is one of the older platforms unclear if it integrates GenAI.

## Approaches

Software agents have been around for a while, they can be created using various approaches based on rules, machine learning with different level of supervision or with reinforcement learning, or a combination of both. Here are some common approaches to creating software agents:

1. **Rule-Based Systems**: These systems use predefined rules to determine how an agent should respond to user input. They are simple to implement but can be inflexible and difficult to scale. Modern apporaches go towards hybrid systems that combine rules with machine learning.

2. **Machine Learning**: This approach involves training models on large datasets to create *agents* that understand and respond to their *environment* or user input. 

3. **Hybrid Systems**: These systems combine rule-based and machine learning approaches,e.g., symbolic ML and neuro-symbolic systems.
