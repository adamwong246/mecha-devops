rm -rf ./log/github_com_adamwong246_testpros_git_master/544bedfb2a9f88f8f9421630537ca5807c4dcb9f;  mkdir -p ./log/github_com_adamwong246_testpros_git_master/544bedfb2a9f88f8f9421630537ca5807c4dcb9f;  cd ./pen/github_com_adamwong246_testpros_git_master &&  git fetch origin &&  git checkout 544bedfb2a9f88f8f9421630537ca5807c4dcb9f &&  docker build -t github_com_adamwong246_testpros_git_master . && docker attach $(docker run -i -d github_com_adamwong246_testpros_git_master npm run lint) &> ../../log/github_com_adamwong246_testpros_git_master/544bedfb2a9f88f8f9421630537ca5807c4dcb9f/lint.log && docker attach $(docker run -i -d github_com_adamwong246_testpros_git_master npm run test) &> ../../log/github_com_adamwong246_testpros_git_master/544bedfb2a9f88f8f9421630537ca5807c4dcb9f/test.log